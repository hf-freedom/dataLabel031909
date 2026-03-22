import type { Directive, DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores'

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    const authStore = useAuthStore()
    
    if (value && typeof value === 'string') {
      const hasPermission = authStore.hasPermission(value)
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    } else if (value && Array.isArray(value)) {
      const hasPermission = value.some((permission) => authStore.hasPermission(permission))
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    } else {
      throw new Error('need permission! Like v-permission="\'system:user:add\'" or v-permission="[\'system:user:add\', \'system:user:edit\']"')
    }
  },
}

export const role: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    const authStore = useAuthStore()
    
    if (value && typeof value === 'string') {
      const hasRole = authStore.userInfo?.roles?.some(r => r.code === value)
      if (!hasRole) {
        el.parentNode?.removeChild(el)
      }
    } else if (value && Array.isArray(value)) {
      const hasRole = value.some((role) => 
        authStore.userInfo?.roles?.some(r => r.code === role)
      )
      if (!hasRole) {
        el.parentNode?.removeChild(el)
      }
    }
  },
}
