import { defineStore } from 'pinia'
import type { Menu } from '@/types'

interface MenuState {
  menus: Menu[]
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menus: [],
  }),

  getters: {
    menuTree: (state): Menu[] => state.menus,
    hasMenus: (state): boolean => state.menus.length > 0,
  },

  actions: {
    setMenus(menus: Menu[]): void {
      this.menus = menus
    },

    clearMenus(): void {
      this.menus = []
    },
  },
})
