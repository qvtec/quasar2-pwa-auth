<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="col-xs-12 col-sm-7 col-lg-5">
      <q-card flat bordered>
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">2段階認証</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form class="q-gutter-md" @submit="login">

            <q-input
              outlined
              hide-bottom-space
              v-model="code"
              label="Code"
              lazy-rules
              :rules="[val => !!val || '入力してください']"
            >
            </q-input>

            <q-checkbox v-model="use_recovery_code" label="リカバリーコードを使う" />

            <div>
              <q-btn
                class="full-width"
                label="ログイン"
                :loading="loading"
                type="submit"
                color="accent"
                size="lg" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'

export interface TwoFactorChallenge {
  recovery_code?: string;
  code?: string;
}

export default defineComponent({
  name: 'TwoFactorChallengePage',
  setup() {
    const $q = useQuasar()
    const $router = useRouter()

    const loading = ref(false)
    const code = ref('')
    const use_recovery_code = ref(false)

    function login () {
      loading.value = true

      const params: TwoFactorChallenge = {}

      if (use_recovery_code.value) {
        params.recovery_code = code.value
      } else {
        params.code = code.value
      }

      api.post('two-factor-challenge', params)
        .then(() => {
          $router.replace({ name: 'home' })
          $q.notify({ type: 'positive', message: 'ログインに成功しました' })
        })
        .catch(() => {
          $router.replace({ name: 'login' })
          $q.notify({ type: 'negative', message: 'ログインに失敗しました' })
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      loading,
      code,
      use_recovery_code,
      login,
    }
  }
})
</script>
