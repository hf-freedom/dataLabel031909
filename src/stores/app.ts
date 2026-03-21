import { defineStore } from 'pinia'
import type { App } from '@/types'
import { appApi } from '@/api'

interface AppState {
  apps: App[]
  currentApp: App | null
  loading: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    apps: [],
    currentApp: null,
    loading: false,
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const res = await appApi.getAll()
        this.apps = res.data
        return res.data
      } finally {
        this.loading = false
      }
    },

    setCurrentApp(app: App) {
      this.currentApp = app
      localStorage.setItem('currentAppId', String(app.id))
    },

    getCurrentApp(): App | null {
      if (this.currentApp) return this.currentApp
      const appId = localStorage.getItem('currentAppId')
      if (appId && this.apps.length) {
        this.currentApp = this.apps.find(a => a.id === Number(appId)) || this.apps[0]
      }
      return this.currentApp
    },
  },
})
