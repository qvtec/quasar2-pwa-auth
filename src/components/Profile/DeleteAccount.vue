<template>
  <q-card flat bordered>
    <q-card-section class="bg-grey-2">
      <div class="text-h6">アカウント削除</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div>
        <q-btn
          label="アカウント削除"
          color="negative"
          @click="openDelDialog" />
      </div>
    </q-card-section>

    <q-dialog v-model="delDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">アカウント削除</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" @submit="onSubmit">
            <q-input
              dense
              hide-bottom-space
              autofocus
              v-model="form.password"
              label="Password"
              type="password"
              lazy-rules
              :rules="[
                val => !!val || '入力してください',
                val => val.length >= 6 || '6文字以上にしてください'
              ]"
              :error="!!errors.password && errors.password.length>0"
              @keyup.enter="delDialog = false"
            >
              <template v-slot:error>
                <div v-for="(error, key) in errors.password" :key="key">
                  {{ error }}
                </div>
              </template>
            </q-input>

            <div align="right">
              <q-btn flat label="キャンセル" v-close-popup />
              <q-btn flat label="削除" color="negative" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

export default defineComponent({
  name: 'ProfileDeleteAccountComponent',
  setup() {
    const $q = useQuasar()
    const $authStore = useAuthStore()
    const $router = useRouter()

    const loading = ref(false)
    const errors = ref({})
    const delDialog = ref(false)
    const form = ref({
      password: ''
    })

    function openDelDialog () {
      delDialog.value = true
      form.value.password = ''
    }

    function onSubmit () {
      loading.value = true

      const params = {
        'password': form.value.password
      }

      api.delete('user', { params })
        .then(() => {
          $authStore.logout()
          $router.replace({ name: 'top' })
          $q.notify({ type: 'positive', message: '削除しました' })
        })
        .catch(error => {
          if (error.response.status === 422) {
            errors.value = error.response.data.errors
          }
        })
        .finally(() => { loading.value = false })
    }

    return {
      loading,
      errors,
      delDialog,
      form,
      openDelDialog,
      onSubmit,
    }
  }
})
</script>
