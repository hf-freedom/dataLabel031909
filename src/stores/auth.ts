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
    isLoggedIn: (state): boolean => !!state.token,
    hasPermission: (state): ((permission: string) => boolean) => {
      return (permission: string) => state.permissions.includes(permission)
    },
  },

  actions: {
    setToken(token: string): void {
      this.token = token
      localStorage.setItem('token', token)
    },

    setUserInfo(userInfo: User): void {
      this.userInfo = userInfo
    },

    setPermissions(permissions: string[]): void {
      this.permissions = permissions
    },

    logout(): void {
      this.token = ''
      this.userInfo = null
      this.permissions = []
      localStorage.removeItem('token')
      localStorage.removeItem('currentAppId')
    },
  },
})
