import { defineStore } from 'pinia'
import type { Menu } from '@/types'

/**
 * 菜单状态接口
 */
interface MenuState {
  menus: Menu[]
  cachedViews: string[]
}

/**
 * 菜单 Store - 处理菜单数据和路由缓存
 */
export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menus: [],
    cachedViews: [],
  }),

  getters: {
    /**
     * 获取扁平化的菜单列表
     */
    flatMenus: (state): Menu[] => {
      const flatten = (menus: Menu[]): Menu[] => {
        const result: Menu[] = []
        menus.forEach(menu => {
          result.push(menu)
          if (menu.children && menu.children.length > 0) {
            result.push(...flatten(menu.children))
          }
        })
        return result
      }
      return flatten(state.menus)
    },

    /**
     * 获取所有权限标识
     */
    allPermissions: (state): string[] => {
      const permissions: string[] = []
      const collect = (menus: Menu[]) => {
        menus.forEach(menu => {
          if (menu.permission) {
            permissions.push(menu.permission)
          }
          if (menu.children) {
            collect(menu.children)
          }
        })
      }
      collect(state.menus)
      return permissions
    },
  },

  actions: {
    /**
     * 设置菜单列表
     */
    setMenus(menus: Menu[]): void {
      this.menus = menus
    },

    /**
     * 根据 ID 查找菜单
     */
    findMenuById(id: number): Menu | null {
      const find = (menus: Menu[]): Menu | null => {
        for (const menu of menus) {
          if (menu.id === id) return menu
          if (menu.children) {
            const found = find(menu.children)
            if (found) return found
          }
        }
        return null
      }
      return find(this.menus)
    },

    /**
     * 根据权限标识查找菜单
     */
    findMenuByPermission(permission: string): Menu | null {
      const find = (menus: Menu[]): Menu | null => {
        for (const menu of menus) {
          if (menu.permission === permission) return menu
          if (menu.children) {
            const found = find(menu.children)
            if (found) return found
          }
        }
        return null
      }
      return find(this.menus)
    },

    /**
     * 添加缓存视图
     */
    addCachedView(name: string): void {
      if (!this.cachedViews.includes(name)) {
        this.cachedViews.push(name)
      }
    },

    /**
     * 移除缓存视图
     */
    removeCachedView(name: string): void {
      const index = this.cachedViews.indexOf(name)
      if (index > -1) {
        this.cachedViews.splice(index, 1)
      }
    },

    /**
     * 清空缓存视图
     */
    clearCachedViews(): void {
      this.cachedViews = []
    },

    /**
     * 重置菜单状态
     */
    reset(): void {
      this.menus = []
      this.cachedViews = []
    },
  },
})
