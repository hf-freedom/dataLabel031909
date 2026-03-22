import { defineStore } from 'pinia'

interface LoadingState {
  loadingCount: number
  loadingMap: Map<string, boolean>
}

export const useLoadingStore = defineStore('loading', {
  state: (): LoadingState => ({
    loadingCount: 0,
    loadingMap: new Map(),
  }),

  getters: {
    isLoading: (state): boolean => state.loadingCount > 0,
    isLoadingByKey: (state): ((key: string) => boolean) => {
      return (key: string) => state.loadingMap.get(key) ?? false
    },
  },

  actions: {
    startLoading(key?: string): void {
      this.loadingCount++
      if (key) {
        this.loadingMap.set(key, true)
      }
    },

    stopLoading(key?: string): void {
      if (this.loadingCount > 0) {
        this.loadingCount--
      }
      if (key) {
        this.loadingMap.set(key, false)
      }
    },

    resetLoading(): void {
      this.loadingCount = 0
      this.loadingMap.clear()
    },
  },
})
