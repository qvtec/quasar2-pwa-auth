<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'App',
  setup () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    document.addEventListener('swUpdated', (e:Event) => { updateAvailable() }, { once: true })

    function updateAvailable () {
      Notify.create({
        icon: 'cloud_download',
        color: 'primary',
        message: 'Updated content is available. Please refresh the page. ',
        multiLine: true,
        timeout: 0,
        actions: [
          { label: 'Refresh', color: 'white', handler: () => { window.location.reload() } },
          { label: 'Dismiss', color: 'secondary' }
        ]
      })
    }
  }
})
</script>
