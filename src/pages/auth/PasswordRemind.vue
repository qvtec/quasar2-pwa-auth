<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="col-xs-12 col-sm-7 col-lg-5">
      <q-card flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6">パスワード再発行</div>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="sent">
          パスワード再発行用URLを送信しました。
        </q-card-section>

        <q-card-section v-else>
          <q-form class="q-gutter-md" @submit="onSubmit">

            <q-input
              outlined
              hide-bottom-space
              v-model="form.email"
              label="Email"
              type="email"
              lazy-rules
              :rules="[val => !!val || '入力してください']"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <div>
              <q-btn
                class="full-width"
                label="送信"
                :loading="loading"
                type="submit"
                color="secondary"
                size="lg" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
      <div class="q-py-md">
        <q-btn flat color="primary" label="ログイン画面はこちら" to="/auth/login" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'PasswordRemindPage',
  setup() {
    const $q = useQuasar()

    const loading = ref(false)
    const sent = ref(false)
    const form = ref({
      email: ''
    })

    function onSubmit () {
      loading.value = true

      api.post('forgot-password', form.value)
        .then(response => {
          sent.value = true
          $q.notify({ type: 'positive', message: response.data.message })
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      form,
      loading,
      sent,
      onSubmit
    }
  }
})
</script>
