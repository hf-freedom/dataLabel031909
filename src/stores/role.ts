import { defineStore } from 'pinia'
import type { Role } from '@/types'
import { roleApi } from '@/api'

interface RoleState {
  roles: Role[]
  loading: boolean
}

export const useRoleStore = defineStore('role', {
  state: (): RoleState => ({
    roles: [],
    loading: false,
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const res = await roleApi.getAll()
        this.roles = res.data
        return res.data
      } finally {
        this.loading = false
      }
    },
  },
})
