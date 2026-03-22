import { defineStore } from 'pinia'
import type { App } from '@/types'
import { appApi } from '@/api'

/**
 * 应用状态接口
 */
interface AppState {
  apps: App[]
  currentApp: App | null
  loading: boolean
  sidebarCollapsed: boolean
}

/**
 * 应用状态 Store - 处理应用列表、当前应用、侧边栏状态等
 */
export const useAppStateStore = defineStore('appState', {
  state: (): AppState => ({
    apps: [],
    currentApp: null,
    loading: false,
    sidebarCollapsed: false,
  }),

  getters: {
    /**
     * 当前应用 ID
     */
    currentAppId: (state): number | null => state.currentApp?.id || null,

    /**
     * 应用列表（按状态过滤，只显示启用的）
     */
    enabledApps: (state): App[] => {
      return state.apps.filter(app => app.status === 1)
    },

    /**
     * 根据 ID 获取应用
     */
    getAppById: (state) => {
      return (id: number): App | null => {
        return state.apps.find(app => app.id === id) || null
      }
    },
  },

  actions: {
    /**
     * 设置应用列表
     */
    setApps(apps: App[]): void {
      this.apps = apps
    },

    /**
     * 设置当前应用
     */
    setCurrentApp(app: App | null): void {
      this.currentApp = app
      if (app) {
        localStorage.setItem('currentAppId', String(app.id))
      } else {
        localStorage.removeItem('currentAppId')
      }
    },

    /**
     * 根据 ID 设置当前应用
     */
    setCurrentAppById(appId: number): boolean {
      const app = this.apps.find(a => a.id === appId)
      if (app) {
        this.setCurrentApp(app)
        return true
      }
      return false
    },

    /**
     * 切换侧边栏折叠状态
     */
    toggleSidebar(): void {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    /**
     * 设置侧边栏折叠状态
     */
    setSidebarCollapsed(collapsed: boolean): void {
      this.sidebarCollapsed = collapsed
    },

    /**
     * 获取当前应用（优先从内存，其次从 localStorage）
     */
    getCurrentApp(): App | null {
      if (this.currentApp) return this.currentApp

      const appId = localStorage.getItem('currentAppId')
      if (appId && this.apps.length > 0) {
        const app = this.apps.find(a => a.id === Number(appId))
        if (app) {
          this.currentApp = app
          return app
        }
      }

      // 默认返回第一个应用
      if (this.apps.length > 0) {
        this.currentApp = this.apps[0]
        return this.currentApp
      }

      return null
    },

    /**
     * 异步获取所有应用
     */
    async fetchApps(): Promise<App[]> {
      this.loading = true
      try {
        const res = await appApi.getAll()
        this.apps = res.data

        // 恢复当前应用
        const savedAppId = localStorage.getItem('currentAppId')
        if (savedAppId) {
          const savedApp = this.apps.find(a => a.id === Number(savedAppId))
          if (savedApp) {
            this.currentApp = savedApp
          } else if (this.apps.length > 0) {
            this.currentApp = this.apps[0]
          }
        } else if (this.apps.length > 0) {
          this.currentApp = this.apps[0]
        }

        return res.data
      } finally {
        this.loading = false
      }
    },

    /**
     * 重置应用状态
     */
    reset(): void {
      this.apps = []
      this.currentApp = null
      this.loading = false
      this.sidebarCollapsed = false
      localStorage.removeItem('currentAppId')
    },
  },
})
