import { defineStore } from 'pinia'
import type { App } from '@/types'

interface AppState {
  apps: App[]
  currentApp: App | null
  loading: boolean
  sidebarCollapsed: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    apps: [],
    currentApp: null,
    loading: false,
    sidebarCollapsed: localStorage.getItem('sidebarCollapsed') === 'true',
  }),

  getters: {
    currentAppId: (state): number | null => state.currentApp?.id ?? null,
    hasApps: (state): boolean => state.apps.length > 0,
  },

  actions: {
    setApps(apps: App[]): void {
      this.apps = apps
    },

    setCurrentApp(app: App): void {
      this.currentApp = app
      localStorage.setItem('currentAppId', String(app.id))
    },

    setLoading(loading: boolean): void {
      this.loading = loading
    },

    toggleSidebar(): void {
      this.sidebarCollapsed = !this.sidebarCollapsed
      localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed))
    },

    setSidebarCollapsed(collapsed: boolean): void {
      this.sidebarCollapsed = collapsed
      localStorage.setItem('sidebarCollapsed', String(collapsed))
    },

    getCurrentApp(): App | null {
      if (this.currentApp) return this.currentApp
      const appId = localStorage.getItem('currentAppId')
      if (appId && this.apps.length) {
        this.currentApp = this.apps.find(a => a.id === Number(appId)) || this.apps[0]
      }
      return this.currentApp
    },

    clearApp(): void {
      this.apps = []
      this.currentApp = null
      this.loading = false
    },
  },
})
