import { defineStore } from 'pinia'
import type { App } from '@/types'

interface AppState {
  currentApp: App | null
  apps: App[]
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    currentApp: null,
    apps: [],
  }),

  actions: {
    setCurrentApp(app: App) {
      this.currentApp = app
      localStorage.setItem('currentAppId', String(app.id))
    },

    setApps(apps: App[]) {
      this.apps = apps
    },

    clearApps() {
      this.currentApp = null
      this.apps = []
      localStorage.removeItem('currentAppId')
    },
  },
})
