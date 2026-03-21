import type { App } from 'vue'
import { permission, role } from './permission'

export default {
  install(app: App) {
    app.directive('permission', permission)
    app.directive('role', role)
  },
}
