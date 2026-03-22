import { createApp, ErrorHandler } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import directives from './directives'
import './mock'
import './styles/index.scss'

const app = createApp(App)

// 全局错误处理
const errorHandler: ErrorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Error info:', info)
  
  // 显示错误提示
  const message = err instanceof Error ? err.message : '未知错误'
  ElMessage.error(`系统错误: ${message}`)
}

app.config.errorHandler = errorHandler

// 未处理的Promise rejection
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise rejection:', event.reason)
  const message = event.reason?.message || '网络请求错误'
  ElMessage.error(`请求错误: ${message}`)
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.use(directives)

app.mount('#app')
