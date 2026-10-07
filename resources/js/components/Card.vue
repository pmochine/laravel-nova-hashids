<template>
  <LoadingCard :loading="loading" class="nova-hashids px-6 py-4">
    <div class="nova-hashids__header">
      <h3 class="text-sm font-bold">{{ __('Hashids Converter') }}</h3>

      <SelectControl
        v-if="connections.length > 1"
        v-model="connection"
        :options="options"
        :aria-label="__('Connection')"
        size="sm"
        dusk="hashids-connection"
      />
    </div>

    <p
      v-if="notice"
      class="nova-hashids__notice text-sm text-gray-500"
      dusk="hashids-notice"
    >
      {{ notice }}
    </p>

    <form v-else-if="!loading" @submit.prevent="convert">
      <p
        v-if="connectionWarning"
        class="nova-hashids__warning text-xs text-red-500"
        role="alert"
        dusk="hashids-connection-warning"
      >
        {{ connectionWarning }}
      </p>

      <div class="nova-hashids__fields">
        <input
          :value="hashId"
          type="text"
          autocomplete="off"
          dusk="hashid"
          class="w-full form-control form-input form-control-bordered"
          :class="{ 'form-control-bordered-error': errorField === 'hashId' }"
          :placeholder="__('Hashid')"
          :aria-label="__('Hashid')"
          @input="setHashId($event.target.value)"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
          class="nova-hashids__icon text-gray-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>

        <input
          :value="modelId"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          dusk="normalid"
          class="w-full form-control form-input form-control-bordered"
          :class="{ 'form-control-bordered-error': errorField === 'modelId' }"
          :placeholder="__('Model ID')"
          :aria-label="__('Model ID')"
          @input="setModelId($event.target.value)"
        />
      </div>

      <p
        v-if="error"
        class="nova-hashids__error text-xs text-red-500"
        role="alert"
        dusk="hashids-error"
      >
        {{ error }}
      </p>

      <div class="nova-hashids__actions">
        <Button
          v-if="hashId.trim() !== ''"
          type="button"
          variant="ghost"
          :label="__('Copy hashid')"
          dusk="copy-hashid-button"
          @click="copyHashId"
        />

        <Button
          type="submit"
          :label="__('Convert')"
          :loading="converting"
          dusk="convert-button"
        />
      </div>
    </form>
  </LoadingCard>
</template>

<script>
import { Button } from 'laravel-nova-ui'

const endpoint = '/nova-vendor/laravel-nova-hashids/hashids'

export default {
  components: {
    Button,
  },

  props: {
    card: { type: Object, default: () => ({}) },

    // Nova passes the id of the resource only on resource detail pages.
    resourceId: { type: [String, Number], default: null },
  },

  data: () => ({
    loading: true,
    failed: false,
    converting: false,
    connections: [],
    connection: null,
    hashId: '',
    modelId: '',
    error: null,
    errorField: null,
    connectionWarning: null,
    lastRequest: 0,
  }),

  computed: {
    options() {
      return this.connections.map(name => ({
        value: name,
        label: name.charAt(0).toUpperCase() + name.slice(1),
      }))
    },

    notice() {
      if (this.failed) {
        return this.__('The card could not load the Hashids connections.')
      }

      if (!this.loading && this.connections.length === 0) {
        return this.__('There are no Hashids connections. Check config/hashids.php.')
      }

      return null
    },
  },

  watch: {
    connection(value, previous) {
      if (previous === null) {
        return
      }

      if (this.hashId !== '' || this.modelId !== '') {
        this.convert()
      } else {
        this.forgetConversions()
      }
    },
  },

  mounted() {
    this.load()
  },

  methods: {
    load() {
      return Nova.request()
        .get(endpoint)
        .then(({ data }) => {
          this.connections = data.connections
          this.connection = this.initialConnection(data)
          this.convertResourceId()
        })
        .catch(() => {
          this.failed = true
        })
        .finally(() => {
          this.loading = false
        })
    },

    initialConnection({ connections, default: fallback }) {
      const wanted = this.card?.connection

      if (wanted == null || connections.includes(wanted)) {
        return wanted ?? fallback
      }

      this.connectionWarning = this.__(
        'The connection :connection does not exist. Check config/hashids.php.',
        { connection: wanted }
      )

      return fallback
    },

    // On a resource detail page, show the hashid of the resource.
    convertResourceId() {
      const id = this.resourceId == null ? '' : String(this.resourceId)

      if (this.connections.length > 0 && /^\d+$/.test(id)) {
        this.modelId = id
        this.convert()
      }
    },

    setHashId(value) {
      this.hashId = value
      this.modelId = ''
      this.forgetConversions()
    },

    setModelId(value) {
      this.modelId = value
      this.hashId = ''
      this.forgetConversions()
    },

    // A running conversion belongs to an older input. Ignore its answer.
    forgetConversions() {
      this.lastRequest++
      this.converting = false
      this.clearError()
    },

    convert() {
      const request = ++this.lastRequest
      const isLatest = () => request === this.lastRequest

      this.clearError()
      this.converting = true

      return Nova.request()
        .post(endpoint, this.payload())
        .then(({ data }) => {
          if (isLatest()) {
            this.hashId = data.hashId
            this.modelId = data.modelId
          }
        })
        .catch(error => {
          if (isLatest()) {
            this.showError(error)
          }
        })
        .finally(() => {
          if (isLatest()) {
            this.converting = false
          }
        })
    },

    payload() {
      const modelId = this.modelId.trim()

      // After a conversion both fields hold a value. The model id wins.
      return modelId !== ''
        ? { connection: this.connection, modelId }
        : { connection: this.connection, hashId: this.hashId.trim() }
    },

    showError(error) {
      const errors = error.response?.status === 422 ? error.response.data?.errors ?? {} : {}
      const field = Object.keys(errors)[0] ?? null

      this.errorField = field
      this.error = field
        ? errors[field][0]
        : this.__('The conversion failed. Check the application log.')
    },

    // The Clipboard API exists only on HTTPS pages and on localhost.
    copyHashId() {
      const clipboard = window.navigator.clipboard
      const copied = clipboard
        ? clipboard.writeText(this.hashId.trim())
        : Promise.reject(new Error('The Clipboard API is not available.'))

      return copied
        .then(() => Nova.success(this.__('Copied the hashid.')))
        .catch(() => Nova.error(this.__('Your browser did not allow copying.')))
    },

    clearError() {
      this.error = null
      this.errorField = null
    },
  },
}
</script>
