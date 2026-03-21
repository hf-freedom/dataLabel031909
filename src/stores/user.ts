import { defineStore } from 'pinia'
import type { User, Menu, App } from '@/types'

interface UserState {
  token: string
  userInfo: User | null
  menus: Menu[]
  permissions: string[]
  currentApp: App | null
  apps: App[]
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
    menus: [],
    permissions: [],
    currentApp: null,
    apps: [],
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

    setMenus(menus: Menu[]) {
      this.menus = menus
    },

    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },

    setCurrentApp(app: App) {
      this.currentApp = app
      localStorage.setItem('currentAppId', String(app.id))
    },

    setApps(apps: App[]) {
      this.apps = apps
    },

    hasPermission(permission: string): boolean {
      return this.permissions.includes(permission)
    },

    logout() {
      this.token = ''
      this.userInfo = null
      this.menus = []
      this.permissions = []
      this.currentApp = null
      this.apps = []
      localStorage.removeItem('token')
      localStorage.removeItem('currentAppId')
    },
  },
})
