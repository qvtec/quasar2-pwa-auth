<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="col-xs-12 col-sm-7 col-lg-5">
      <q-card flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6">パスワード再発行</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form class="q-gutter-md" @submit="onSubmit">

            <q-input
              outlined
              hide-bottom-space
              v-model="credentials.email"
              label="Email"
              type="email"
              lazy-rules
              :rules="[val => !!val || '入力してください']"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <q-input
              outlined
              hide-bottom-space
              v-model="credentials.password"
              label="Password（6文字以上）"
              type="password"
              lazy-rules
              :rules="[
                val => !!val || '入力してください',
                val => val.length >= 6 || '6文字以上にしてください'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
            </q-input>

            <q-input
              outlined
              hide-bottom-space
              v-model="credentials.password_confirmation"
              label="Password（確認）"
              type="password"
              lazy-rules
              :rules="[val => val == credentials.password || 'パスワードが一致しません']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
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
      <div class="q-py-sm">
        <q-btn flat label="ログイン画面はこちら" to="/auth/login" padding="none" color="secondary" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { api } from 'boot/axios'

const $q = useQuasar()
const $router = useRouter()
const $route = useRoute()

const loading = ref(false)
const credentials = ref({
  email: '',
  password: '',
  password_confirmation: ''
})

onMounted(() => {
  credentials.value.email = String($route.query.email)
})

function onSubmit () {
  loading.value = true
  const token = $route.query.token

  api.post('reset-password', { ...credentials.value, token })
    .then(async (response) => {
      await $router.replace({ name: 'login' })
      $q.notify({ type: 'positive', message: response.data.message })
    })
    .finally(() => {
      credentials.value.password = ''
      credentials.value.password_confirmation = ''
      loading.value = false
    })
}
</script>
