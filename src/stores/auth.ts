import { defineStore } from 'pinia'
import type { User, LoginResponse } from '@/types'

/**
 * 认证状态接口
 */
interface AuthState {
  token: string
  userInfo: User | null
  permissions: string[]
}

/**
 * 认证 Store - 处理用户登录、登出、权限相关
 */
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
    permissions: [],
  }),

  getters: {
    /**
     * 是否已登录
     */
    isLoggedIn: (state): boolean => !!state.token,

    /**
     * 用户名
     */
    username: (state): string => state.userInfo?.username || '',

    /**
     * 用户显示名称
     */
    displayName: (state): string => state.userInfo?.name || state.userInfo?.username || '',
  },

  actions: {
    /**
     * 设置 Token
     */
    setToken(token: string): void {
      this.token = token
      localStorage.setItem('token', token)
    },

    /**
     * 设置用户信息
     */
    setUserInfo(userInfo: User): void {
      this.userInfo = userInfo
    },

    /**
     * 设置权限列表
     */
    setPermissions(permissions: string[]): void {
      this.permissions = permissions
    },

    /**
     * 检查是否有指定权限
     */
    hasPermission(permission: string): boolean {
      return this.permissions.includes(permission)
    },

    /**
     * 检查是否有任意一个权限
     */
    hasAnyPermission(permissions: string[]): boolean {
      return permissions.some(p => this.permissions.includes(p))
    },

    /**
     * 检查是否有所有权限
     */
    hasAllPermissions(permissions: string[]): boolean {
      return permissions.every(p => this.permissions.includes(p))
    },

    /**
     * 登录成功处理
     */
    loginSuccess(loginData: LoginResponse): void {
      this.setToken(loginData.token)
      this.setUserInfo(loginData.userInfo)
      this.setPermissions(loginData.permissions)
    },

    /**
     * 登出
     */
    logout(): void {
      this.token = ''
      this.userInfo = null
      this.permissions = []
      localStorage.removeItem('token')
    },
  },
})
