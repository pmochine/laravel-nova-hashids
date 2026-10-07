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

// Nova's __() replaces :placeholders in the key.
function translate(key, replace = {}) {
  return Object.entries(replace).reduce((text, [name, value]) => text.replace(`:${name}`, value), key)
}

async function mountCard(config = { connections: ['main', 'alternative'], default: 'alternative' }, props = {}) {
  if (config) {
    http.get.mockResolvedValue({ data: config })
  }

  const wrapper = mount(Card, {
    props: { card: {}, ...props },
    global: {
      components: { LoadingCard, SelectControl },
      mixins: [{ methods: { __: translate } }],
    },
  })

  await flushPromises()

  return wrapper
}

beforeEach(() => {
  http = { get: vi.fn(), post: vi.fn() }
  globalThis.Nova = { request: () => http, success: vi.fn(), error: vi.fn() }
})

afterEach(() => {
  delete globalThis.Nova
  vi.unstubAllGlobals()
})

function stubClipboard(clipboard) {
  vi.stubGlobal('navigator', { ...window.navigator, clipboard })
}

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

  it('keeps a new input if the answer for an older input arrives', async () => {
    const wrapper = await mountCard()
    const answer = deferred()
    http.post.mockReturnValueOnce(answer.promise)

    await wrapper.find('[dusk="normalid"]').setValue('42')
    await wrapper.find('form').trigger('submit')
    await wrapper.find('[dusk="normalid"]').setValue('7')

    answer.resolve({ data: { hashId: 'abc', modelId: '42' } })
    await flushPromises()

    expect(wrapper.find('[dusk="normalid"]').element.value).toBe('7')
    expect(wrapper.find('[dusk="hashid"]').element.value).toBe('')
    expect(wrapper.find('[dusk="convert-button"]').element.disabled).toBe(false)
  })

  it('ignores the error for an older input', async () => {
    const wrapper = await mountCard()
    const answer = deferred()
    http.post.mockReturnValueOnce(answer.promise.then(error => Promise.reject(error)))

    await wrapper.find('[dusk="hashid"]').setValue('nope')
    await wrapper.find('form').trigger('submit')
    await wrapper.find('[dusk="hashid"]').setValue('abc')

    answer.resolve(validationError({ hashId: ['This hashid is not valid for the selected connection.'] }))
    await flushPromises()

    expect(wrapper.find('[dusk="hashids-error"]').exists()).toBe(false)
  })

  it('ignores an older answer after you clear the fields and change the connection', async () => {
    const wrapper = await mountCard()
    const answer = deferred()
    http.post.mockReturnValueOnce(answer.promise)

    await wrapper.find('[dusk="normalid"]').setValue('42')
    await wrapper.find('form').trigger('submit')
    await wrapper.find('[dusk="normalid"]').setValue('')
    await wrapper.find('select').setValue('main')

    answer.resolve({ data: { hashId: 'abc', modelId: '42' } })
    await flushPromises()

    expect(http.post).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[dusk="hashid"]').element.value).toBe('')
    expect(wrapper.find('[dusk="normalid"]').element.value).toBe('')
  })

  it('ignores the error of an empty form after the connection changes', async () => {
    const wrapper = await mountCard()
    const answer = deferred()
    http.post.mockReturnValueOnce(answer.promise.then(error => Promise.reject(error)))

    await wrapper.find('form').trigger('submit')
    await wrapper.find('select').setValue('main')

    answer.resolve(validationError({ modelId: ['Enter a hashid or a model id.'] }))
    await flushPromises()

    expect(http.post).toHaveBeenCalledTimes(1)
    expect(wrapper.find('[dusk="hashids-error"]').exists()).toBe(false)
    expect(wrapper.find('[dusk="convert-button"]').element.disabled).toBe(false)
  })

  it('selects the connection of the card', async () => {
    const wrapper = await mountCard(undefined, { card: { connection: 'main' } })

    expect(wrapper.find('select').element.value).toBe('main')
    expect(wrapper.find('[dusk="hashids-connection-warning"]').exists()).toBe(false)
  })

  it('warns if the connection of the card does not exist', async () => {
    const wrapper = await mountCard(undefined, { card: { connection: 'users' } })

    expect(wrapper.find('select').element.value).toBe('alternative')
    expect(wrapper.find('[dusk="hashids-connection-warning"]').text()).toBe(
      'The connection users does not exist. Check config/hashids.php.'
    )
  })

  it('keeps the connection warning after a conversion', async () => {
    const wrapper = await mountCard(undefined, { card: { connection: 'users' } })
    http.post.mockResolvedValue({ data: { hashId: 'abc', modelId: '42' } })

    await wrapper.find('[dusk="normalid"]').setValue('42')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[dusk="hashids-connection-warning"]').exists()).toBe(true)
  })

  it('shows the hashid of the resource on a detail page', async () => {
    http.post.mockResolvedValue({ data: { hashId: 'abc', modelId: '42' } })

    const wrapper = await mountCard(undefined, { card: { connection: 'main' }, resourceId: 42 })

    expect(http.post).toHaveBeenCalledTimes(1)
    expect(http.post).toHaveBeenCalledWith(endpoint, { connection: 'main', modelId: '42' })
    expect(wrapper.find('[dusk="hashid"]').element.value).toBe('abc')
    expect(wrapper.find('[dusk="normalid"]').element.value).toBe('42')
  })

  it('does not convert a resource id that is not a whole number', async () => {
    const wrapper = await mountCard(undefined, { resourceId: '9b1d-uuid' })

    expect(http.post).not.toHaveBeenCalled()
    expect(wrapper.find('[dusk="normalid"]').element.value).toBe('')
  })

  it('does not convert the resource id if there are no connections', async () => {
    await mountCard({ connections: [], default: null }, { resourceId: 42 })

    expect(http.post).not.toHaveBeenCalled()
  })

  it('shows the copy button only if there is a hashid', async () => {
    const wrapper = await mountCard()

    expect(wrapper.find('[dusk="copy-hashid-button"]').exists()).toBe(false)

    await wrapper.find('[dusk="hashid"]').setValue('abc')

    expect(wrapper.find('[dusk="copy-hashid-button"]').exists()).toBe(true)
  })

  it('copies the hashid', async () => {
    const writeText = vi.fn().mockResolvedValue()
    stubClipboard({ writeText })
    const wrapper = await mountCard()

    await wrapper.find('[dusk="hashid"]').setValue(' abc ')
    await wrapper.find('[dusk="copy-hashid-button"]').trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith('abc')
    expect(Nova.success).toHaveBeenCalledWith('Copied the hashid.')
    expect(http.post).not.toHaveBeenCalled()
  })

  it('shows an error if the browser does not allow copying', async () => {
    stubClipboard({ writeText: vi.fn().mockRejectedValue(new Error('NotAllowedError')) })
    const wrapper = await mountCard()

    await wrapper.find('[dusk="hashid"]').setValue('abc')
    await wrapper.find('[dusk="copy-hashid-button"]').trigger('click')
    await flushPromises()

    expect(Nova.error).toHaveBeenCalledWith('Your browser did not allow copying.')
  })

  it('shows an error if the page has no Clipboard API', async () => {
    stubClipboard(undefined)
    const wrapper = await mountCard()

    await wrapper.find('[dusk="hashid"]').setValue('abc')
    await wrapper.find('[dusk="copy-hashid-button"]').trigger('click')
    await flushPromises()

    expect(Nova.error).toHaveBeenCalledWith('Your browser did not allow copying.')
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
