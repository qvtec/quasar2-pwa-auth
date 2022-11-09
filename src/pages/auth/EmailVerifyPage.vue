<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="col-xs-12 col-sm-7 col-lg-5">
      <q-card flat bordered>
        <q-card-section class="bg-grey-2">
          <div class="text-h6">メール認証</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          登録したメールアドレス<strong>{{ user.email }}</strong>に認証URLを送信しています。<br />
          届いたリンクからアカウント登録を完了させてください。
        </q-card-section>

        <q-separator />

        <q-card-section>
          リンクが届かない場合は認証メールを再送信してください。
        </q-card-section>

        <q-card-section>
          <q-btn
            flat
            color="primary"
            label="認証メールを再送信する"
            :loading="loading"
            icon="mail_outline"
            @click="verifySend"
            padding="none"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { api } from 'boot/axios'

const $q = useQuasar()
const $router = useRouter()
const $authStore = useAuthStore()

const loading = ref(false)

if (!$authStore.user) {
  $router.push({ name: 'login' })
}

const user = computed(() => {
  return $authStore.user
})

function verifySend () {
  loading.value = true

  api.post('email/verification-notification')
    .then(() => {
      $q.notify({ type: 'positive', message: '認証用URLを送信しました' })
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
