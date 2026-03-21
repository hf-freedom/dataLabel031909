import { defineStore } from 'pinia'
import type { Organization } from '@/types'
import { organizationApi } from '@/api'

interface OrgState {
  tree: Organization[]
  loading: boolean
}

export const useOrgStore = defineStore('organization', {
  state: (): OrgState => ({
    tree: [],
    loading: false,
  }),

  actions: {
    async fetchTree() {
      this.loading = true
      try {
        const res = await organizationApi.getTree()
        this.tree = res.data
        return res.data
      } finally {
        this.loading = false
      }
    },

    findNode(id: number, nodes: Organization[] = this.tree): Organization | null {
      for (const node of nodes) {
        if (node.id === id) return node
        if (node.children) {
          const found = this.findNode(id, node.children)
          if (found) return found
        }
      }
      return null
    },

    getNodePath(id: number, nodes: Organization[] = this.tree, path: Organization[] = []): Organization[] | null {
      for (const node of nodes) {
        if (node.id === id) {
          return [...path, node]
        }
        if (node.children) {
          const result = this.getNodePath(id, node.children, [...path, node])
          if (result) return result
        }
      }
      return null
    },
  },
})
