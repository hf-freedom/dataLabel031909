import { defineStore } from 'pinia'

interface LoadingState {
  globalLoading: boolean
  loadingCount: number
}

export const useLoadingStore = defineStore('loading', {
  state: (): LoadingState => ({
    globalLoading: false,
    loadingCount: 0,
  }),

  actions: {
    startLoading() {
      this.loadingCount++
      this.globalLoading = true
    },

    stopLoading() {
      this.loadingCount--
      if (this.loadingCount <= 0) {
        this.loadingCount = 0
        this.globalLoading = false
      }
    },

    resetLoading() {
      this.loadingCount = 0
      this.globalLoading = false
    },
  },
})
