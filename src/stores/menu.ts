import { defineStore } from 'pinia'
import type { Menu } from '@/types'

interface MenuState {
  menus: Menu[]
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menus: [],
  }),

  actions: {
    setMenus(menus: Menu[]) {
      this.menus = menus
    },

    clearMenus() {
      this.menus = []
    },
  },
})
