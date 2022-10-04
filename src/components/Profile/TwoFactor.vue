<template>
  <q-card flat bordered>
    <q-card-section class="bg-grey-2">
      <div class="text-h6">2段階認証</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div>
        <q-btn
          v-if="twoFactor"
          label="無効にする"
          :loading="loading"
          color="secondary"
          @click="disable"
        />
        <q-btn
          v-else
          label="有効にする"
          :loading="loading"
          color="accent"
          @click="enable"
        />
      </div>
    </q-card-section>

    <q-dialog v-model="twoFactorDialog" persistent>
      <q-card style="min-width: 200px">
        <q-card-section>
          <div class="text-h6">認証コード</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>QRコードをアプリからスキャンしてください</p>
          <span v-html="qrCode"></span>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6">Recovery Codes</div>
          <div v-for="(code, i) in recoveryCodes" :key="i">
            {{ code }}
          </div>
        </q-card-section>

        <q-card-actions vertical>
            <q-btn color="secondary" label="閉じる" v-close-popup />
        </q-card-actions>

        <q-inner-loading :showing="codeLoading">
          <q-spinner size="md" color="primary" />
        </q-inner-loading>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">パスワード確認</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md" @submit="confirm">
            <q-input
              dense
              hide-bottom-space
              autofocus
              v-model="password"
              label="Password"
              type="password"
              lazy-rules
              :rules="[
                val => !!val || '入力してください',
                val => val.length >= 6 || '6文字以上にしてください'
              ]"
              :error="!!errors.password && errors.password.length>0"
              @keyup.enter="confirmDialog = false"
            >
              <template v-slot:error>
                <div v-for="(error, key) in errors.password" :key="key">
                  {{ error }}
                </div>
              </template>
            </q-input>

            <div align="right" class="q-gutter-md">
              <q-btn flat label="キャンセル" v-close-popup />
              <q-btn label="確認" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import { storeToRefs } from 'pinia'
import { api } from 'boot/axios'

export interface QrCode {
  password: string;
}

export default defineComponent({
  name: 'ProfileTwoFactorComponent',
  setup() {
    const $authStore = useAuthStore()

    const loading = ref(false)
    const password = ref('')
    const confirmDialog = ref(false)
    const twoFactorDialog = ref(false)
    const qrCode = ref(null)
    const recoveryCodes = ref([])
    const codeLoading = ref(false)
    const errors = ref({})

    const { twoFactor } = storeToRefs($authStore)

    function enable () {
      loading.value = true
      api.post('user/two-factor-authentication')
        .then(() => {
          api.get('user/two-factor-qr-code')
            .then(res => {
              qrCode.value = res.data.svg
              codeLoading.value = false
            })

          api.get('user/two-factor-recovery-codes')
            .then(res => {
              recoveryCodes.value = res.data
            })

          codeLoading.value = true
          confirmDialog.value = false
          twoFactorDialog.value = true
          $authStore.setTowFactor(true)
        })
        .catch(err => {
          if (err.response.status === 423) {
            confirmDialog.value = true
          }
        })
        .finally(() => {
          loading.value = false
        })
    }

    function disable () {
      loading.value = true
      api.delete('user/two-factor-authentication')
        .then(() => {
          $authStore.setTowFactor(false)
          confirmDialog.value = false
        })
        .catch(err => {
          if (err.response.status === 423) {
            confirmDialog.value = true
          }
        })
        .finally(() => {
          loading.value = false
        })
    }

    function confirm () {
      api.post('user/confirm-password', { password: password.value })
        .then(() => {
          if ($authStore.twoFactor) {
            disable()
          } else {
            enable()
          }
        })
        .catch(err => {
          if (err.response.status === 422) {
            errors.value = err.response.data.errors
          }
        })
    }
    return {
      loading,
      errors,
      password,
      confirmDialog,
      twoFactorDialog,
      qrCode,
      recoveryCodes,
      codeLoading,
      twoFactor,
      enable,
      disable,
      confirm
    }
  }
})
</script>
