<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="col-xs-12 col-sm-7 col-lg-5" v-if="!user">
      <q-card flat bordered>
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">Login</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form class="q-gutter-md" @submit.prevent.stop="onSubmit">

            <q-input
              outlined
              hide-bottom-space
              v-model="credentials.email"
              label="Email"
              type="email"
              lazy-rules
              :rules="[
                val => !!val || '入力してください',
                val => isEmail(val) || 'メールアドレスを入力してください'
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </q-input>

            <q-input
              outlined
              hide-bottom-space
              v-model="credentials.password"
              label="Password"
              :type="isPwd ? 'password' : 'text'"
              lazy-rules
              :rules="[val => !!val || '入力してください']"
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-checkbox v-model="remember" label="ログイン状態を保持" />

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
      <div class="q-py-sm">
        <q-btn flat label="パスワード再発行" to="/password/remind" icon="o_lock" color="secondary" />
        <q-btn flat label="アカウント登録" to="/auth/signup" icon="person_add" color="secondary" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { isEmail } from '../../helpers/patterns'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'
import { Credentials } from 'components/models'

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const $q = useQuasar()
    const $authStore = useAuthStore()
    const $router = useRouter()

    const loading = ref(false)
    const remember = ref(false)
    const credentials = ref<Credentials>({
      email: '',
      password: '',
      remember: false
    });

    const user = computed(() => {
      return $authStore.user
    })

    function onSubmit() {
      loading.value = true

      if (remember.value) {
        credentials.value.remember = true
      }

      $authStore.login(credentials.value)
        .then(async () => {
          if (!$authStore.isAuth) {
            if ($authStore.twoFactor) {
              $router.push({ name: 'twofactor' })
              return
            }
          }

          await $router.push({ name: 'home' })
          $q.notify({ type: 'positive', message: 'ログインに成功しました' })
        })
        .catch(() => {
          $q.notify({ type: 'negative', message: 'ログインに失敗しました' })
          loading.value = false
        })
    }

    return {
      isPwd: ref(true),
      loading,
      user,
      remember,
      credentials,
      isEmail,
      onSubmit
    }
  }
})
</script>
