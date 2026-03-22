import { defineStore } from 'pinia'
import type { User, PageResult, PageInfo } from '@/types'
import { UserStatus } from '@/types'

export interface UserQuery extends PageInfo {
  username?: string
  name?: string
  phone?: string
  status?: UserStatus
  orgId?: number
}

export interface UserForm {
  id?: number
  username: string
  name: string
  phone: string
  email: string
  status: UserStatus
  orgIds: number[]
  primaryOrgId: number | null
  roleIds: number[]
  password?: string
}

interface UserState {
  users: User[]
  currentUser: User | null
  loading: boolean
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUser: null,
    loading: false,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
    },
  }),

  getters: {
    hasUsers: (state): boolean => state.users.length > 0,
  },

  actions: {
    setUsers(users: User[]): void {
      this.users = users
    },

    setCurrentUser(user: User | null): void {
      this.currentUser = user
    },

    setLoading(loading: boolean): void {
      this.loading = loading
    },

    setPagination(pagination: Partial<UserState['pagination']>): void {
      this.pagination = { ...this.pagination, ...pagination }
    },
  },
})
