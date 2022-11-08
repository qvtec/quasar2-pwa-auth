<template>
  <q-page padding class="fit row justify-center q-pa-md items-baseline">
    <div class="col-xs-12 col-sm-7 col-lg-5">
      <q-card flat bordered>
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">Create New Account</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form class="q-gutter-md" @submit.prevent.stop="onSubmit">

            <q-input
              outlined
              hide-bottom-space
              v-model="form.email"
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
              v-model="form.password"
              label="Password"
              :type="isPwd ? 'password' : 'text'"
              lazy-rules
              :rules="[
                val => !!val || '入力してください',
                val => val.length >= 6 || '6文字以上で入力してください',
              ]"
              hint="6文字以上"
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

            <q-input
              outlined
              hide-bottom-space
              v-model="form.password_confirmation"
              label="Password Confirm"
              :type="isPwd ? 'password' : 'text'"
              lazy-rules
              :rules="[
                val => !!val || '入力してください',
                val => val == form.password || 'パスワードが一致しません',
              ]"
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

            <q-input
              outlined
              hide-bottom-space
              v-model="form.name"
              label="Name"
              lazy-rules
              :rules="[
                val => !!val || '入力してください',
                val => val.length >= 3 || '3文字以上で入力してください',
                val => val.length <= 15 || '15文字以下で入力してください',
              ]"
              hint="3～6文字"
            >
              <template v-slot:prepend>
                <q-icon name="face" />
              </template>
            </q-input>

            <div>
              <q-btn
                class="full-width"
                label="アカウント登録"
                :loading="loading"
                type="submit"
                color="accent"
                size="lg" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
      <div class="q-py-sm">
        <q-btn flat label="すでに登録済みの方" to="/auth/login" size="sm" padding="none" color="primary" />
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
import { SignupInterface } from 'components/models'

export default defineComponent({
  name: 'SignupPage',
  setup() {
    const $q = useQuasar()
    const $authStore = useAuthStore()
    const $router = useRouter()

    const loading = ref(false)
    const form = ref<SignupInterface>({
      email: '',
      password: '',
      password_confirmation: '',
      name: ''
    });

    const user = computed(() => {
      return $authStore.user
    })

    function onSubmit() {
      loading.value = true

      $authStore.signup(form.value)
        .then(async () => {
          await $router.push({ name: 'top' })
          $q.dialog({
            title: 'メールアドレス認証',
            html: true,
            message: '<strong>' + form.value.email + '</strong>にメールを送信しました。<br />メールに記載されたURLから認証を完了してください。'
          })
        })
    }

    return {
      isPwd: ref(true),
      loading,
      user,
      form,
      isEmail,
      onSubmit
    }
  }
})
</script>
