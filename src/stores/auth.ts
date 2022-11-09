import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { Credentials, SignupInterface } from '../components/models';

export interface AuthStateInterface {
  user: UserInterface | null
  twoFactor: boolean
}

export interface UserInterface {
  id: number
  name: string
  email: string
  email_verified_at: Date | null
  photo: string | null
  profile_photo_path: string | null
  two_factor_recovery_codes: string| null
  two_factor_secret: string | null
  deleted_at: Date | null
  created_at: Date
  updated_at: Date
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthStateInterface => ({
    user: null,
    twoFactor: false
  }),

  getters: {
    isAuth: (state) => state.user !== null && state.user.email_verified_at !== null
  },

  actions: {
    async login(creds: Credentials) {
      if (this.user) {
        await this.logout()
      }
      await api.post('login', creds)
        .then(res => {
          this.setTowFactor(res.data.two_factor)
        })
      await this.setUser()
    },
    async logout() {
      await api.post('logout')
      this.$reset()
    },
    async signup(params: SignupInterface) {
      await api.post('register', params)
    },
    async setUser() {
      await api.get('me')
        .then(res => {
          if (!res.data) {
            this.$patch({ user: null })
            return
          }
          this.$patch({ user: res.data })
        })
        .catch(error => {
          this.$patch({ user: null })
          throw error
        })
    },
    setTowFactor(val: boolean) {
      this.$patch({ twoFactor: val })
    }
  }
})
