import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Card from '../../resources/js/components/Card.vue'

const endpoint = '/nova-vendor/laravel-nova-hashids/hashids'

// Stubs for the components and helpers that Nova provides at runtime.
const LoadingCard = {
  props: ['loading'],
  template: '<div class="loading-card"><slot /></div>',
}

const SelectControl = {
  props: ['modelValue', 'options'],
  emits: ['update:modelValue'],
  template: `
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  `,
}

function validationError(errors) {
  return Object.assign(new Error('Unprocessable'), {
    response: { status: 422, data: { message: 'Invalid', errors } },
  })
}

function deferred() {
  let resolve
  const promise = new Promise(done => (resolve = done))

  return { promise, resolve }
}

let http

async function mountCard(config = { connections: ['main', 'alternative'], default: 'alternative' }) {
  if (config) {
    http.get.mockResolvedValue({ data: config })
  }

  const wrapper = mount(Card, {
    props: { card: {} },
    global: {
      components: { LoadingCard, SelectControl },
      mixins: [{ methods: { __: key => key } }],
    },
  })

  await flushPromises()

  return wrapper
}

beforeEach(() => {
  http = { get: vi.fn(), post: vi.fn() }
  globalThis.Nova = { request: () => http }
})

afterEach(() => {
  delete globalThis.Nova
})

describe('Card', () => {
  it('selects the default connection', async () => {
    const wrapper = await mountCard()

    expect(http.get).toHaveBeenCalledWith(endpoint)
    expect(wrapper.find('select').element.value).toBe('alternative')
    expect(wrapper.findAll('option').map(option => option.text())).toEqual(['Main', 'Alternative'])
  })

  it('hides the connection select if there is only one connection', async () => {
    const wrapper = await mountCard({ connections: ['main'], default: 'main' })

    expect(wrapper.find('select').exists()).toBe(false)
    expect(wrapper.find('[dusk="hashid"]').exists()).toBe(true)
  })

  it('decodes a hashid with the selected connection', async () => {
    const wrapper = await mountCard()
    http.post.mockResolvedValue({ data: { hashId: 'abc', modelId: '42' } })

    await wrapper.find('[dusk="hashid"]').setValue(' abc ')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(http.post).toHaveBeenCalledWith(endpoint, {
      connection: 'alternative',
      hashId: 'abc',
    })
    expect(wrapper.find('[dusk="normalid"]').element.value).toBe('42')
  })

  it('clears the other field when you type', async () => {
    const wrapper = await mountCard()
    http.post.mockResolvedValue({ data: { hashId: 'abc', modelId: '42' } })

    await wrapper.find('[dusk="hashid"]').setValue('abc')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await wrapper.find('[dusk="normalid"]').setValue('7')

    expect(wrapper.find('[dusk="hashid"]').element.value).toBe('')
  })

  it('converts again with the new connection', async () => {
    const wrapper = await mountCard()
    http.post.mockResolvedValue({ data: { hashId: 'abc', modelId: '42' } })

    await wrapper.find('[dusk="normalid"]').setValue('42')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    http.post.mockResolvedValue({ data: { hashId: 'xyz', modelId: '42' } })
    await wrapper.find('select').setValue('main')
    await flushPromises()

    expect(http.post).toHaveBeenLastCalledWith(endpoint, {
      connection: 'main',
      modelId: '42',
    })
    expect(wrapper.find('[dusk="hashid"]').element.value).toBe('xyz')
  })

  it('does not convert empty fields when the connection changes', async () => {
    const wrapper = await mountCard()

    await wrapper.find('select').setValue('main')
    await flushPromises()

    expect(http.post).not.toHaveBeenCalled()
  })

  it('shows a validation error and keeps the form', async () => {
    const wrapper = await mountCard()
    http.post.mockRejectedValue(validationError({ hashId: ['This hashid is not valid for the selected connection.'] }))

    await wrapper.find('[dusk="hashid"]').setValue('nope')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[dusk="hashids-error"]').text()).toBe('This hashid is not valid for the selected connection.')
    expect(wrapper.find('[dusk="hashid"]').classes()).toContain('form-control-bordered-error')

    await wrapper.find('[dusk="hashid"]').setValue('nop')

    expect(wrapper.find('[dusk="hashids-error"]').exists()).toBe(false)
  })

  it('shows a general error if the conversion fails', async () => {
    const wrapper = await mountCard()
    http.post.mockRejectedValue(Object.assign(new Error('Server Error'), { response: { status: 500, data: {} } }))

    await wrapper.find('[dusk="normalid"]').setValue('42')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[dusk="hashids-error"]').text()).toBe('The conversion failed. Check the application log.')
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('ignores the answer of an older conversion', async () => {
    const wrapper = await mountCard()
    const first = deferred()
    const second = deferred()
    http.post.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)

    await wrapper.find('[dusk="normalid"]').setValue('42')
    await wrapper.find('form').trigger('submit')
    await wrapper.find('form').trigger('submit')

    second.resolve({ data: { hashId: 'new', modelId: '42' } })
    await flushPromises()
    first.resolve({ data: { hashId: 'old', modelId: '42' } })
    await flushPromises()

    expect(wrapper.find('[dusk="hashid"]').element.value).toBe('new')
  })

  it('shows a notice if there are no connections', async () => {
    const wrapper = await mountCard({ connections: [], default: null })

    expect(wrapper.find('[dusk="hashids-notice"]').text()).toBe('There are no Hashids connections. Check config/hashids.php.')
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('shows a notice if the connections can not load', async () => {
    http.get.mockRejectedValue(new Error('Network Error'))

    const wrapper = await mountCard(null)

    expect(wrapper.find('[dusk="hashids-notice"]').text()).toBe('The card could not load the Hashids connections.')
    expect(wrapper.find('form').exists()).toBe(false)
  })
})
