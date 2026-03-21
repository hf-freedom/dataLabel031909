import type { Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores'

export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding
    const userStore = useUserStore()
    
    if (value && typeof value === 'string') {
      const hasPermission = userStore.hasPermission(value)
      if (!hasPermission) {
        el.parentNode?.removeChild(el)
      }
    } else if (value && Array.isArray(value)) {
      const hasPermission = value.some((permission) => userStore.hasPermission(permission))
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
    const userStore = useUserStore()
    
    if (value && typeof value === 'string') {
      const hasRole = userStore.userInfo?.roles?.some(r => r.code === value)
      if (!hasRole) {
        el.parentNode?.removeChild(el)
      }
    } else if (value && Array.isArray(value)) {
      const hasRole = value.some((role) => 
        userStore.userInfo?.roles?.some(r => r.code === role)
      )
      if (!hasRole) {
        el.parentNode?.removeChild(el)
      }
    }
  },
}
