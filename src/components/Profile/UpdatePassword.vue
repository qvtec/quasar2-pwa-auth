<template>
  <q-card flat bordered>
    <q-card-section class="bg-grey-2">
      <div class="text-h6">パスワード更新</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form class="q-gutter-md" @submit="onSubmit">

        <q-input
          outlined
          hide-bottom-space
          v-model="current_password"
          label="現在のパスワード"
          type="password"
          lazy-rules
          :rules="[
            val => !!val || '入力してください',
            val => val.length >= 6 || '6文字以上にしてください'
          ]"
          :error="!!errors.current_password && errors.current_password.length>0"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>

          <template v-slot:error>
            <div v-for="(error, key) in errors.current_password" :key="key">
              {{ error }}
            </div>
          </template>
        </q-input>

        <q-input
          outlined
          hide-bottom-space
          v-model="password"
          label="新しいパスワード（6文字以上）"
          type="password"
          lazy-rules
          :rules="[
            val => !!val || '入力してください',
            val => val.length >= 6 || '6文字以上にしてください'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="o_lock" />
          </template>
        </q-input>

        <q-input
          outlined
          hide-bottom-space
          v-model="password_confirmation"
          label="新しいパスワード（確認）"
          type="password"
          lazy-rules
          :rules="[val => val == password || 'パスワードが一致しません']"
        >
          <template v-slot:prepend>
            <q-icon name="o_lock" />
          </template>
        </q-input>

        <div>
          <q-btn
            label="更新"
            :loading="loading"
            type="submit"
            color="secondary"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'ProfileUpdatePasswordComponent',
  setup () {
    const $q = useQuasar()

    const loading = ref(false)
    const current_password = ref('')
    const password = ref('')
    const password_confirmation = ref('')
    const errors = ref({})

    function onSubmit () {
      loading.value = true

      const params = {
        'current_password': current_password.value,
        'password': password.value,
        'password_confirmation': password_confirmation.value,
      }

      api.put('user/password', params)
        .then(() => {
          $q.notify({ type: 'positive', message: '更新完了しました' })
        })
        .catch(error => {
          if (error.response && error.response.status === 422) {
            errors.value = error.response.data.errors
          }
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      current_password,
      password,
      password_confirmation,
      loading,
      errors,
      onSubmit
    }
  }
})
</script>
