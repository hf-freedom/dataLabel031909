import { defineStore } from 'pinia'
import type { User } from '@/types'

interface AuthState {
  token: string
  userInfo: User | null
  permissions: string[]
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
    permissions: [],
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },

    setUserInfo(userInfo: User) {
      this.userInfo = userInfo
    },

    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },

    hasPermission(permission: string): boolean {
      return this.permissions.includes(permission)
    },

    logout() {
      this.token = ''
      this.userInfo = null
      this.permissions = []
      localStorage.removeItem('token')
    },
  },
})
