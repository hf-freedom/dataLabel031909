import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types'
import { useLoadingStore } from '@/stores'

// 存储每个请求的AbortController
const abortControllers = new Map<string, AbortController>()

// 生成请求唯一标识
const generateRequestKey = (config: AxiosRequestConfig): string => {
  return `${config.method}-${config.url}-${JSON.stringify(config.params || {})}-${Date.now()}`
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const loadingStore = useLoadingStore()
    
    // 显示loading
    loadingStore.startLoading()

    // 添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 创建AbortController并存储
    const controller = new AbortController()
    config.signal = controller.signal
    const requestKey = generateRequestKey(config)
    ;(config as any).requestKey = requestKey
    abortControllers.set(requestKey, controller)

    return config
  },
  (error) => {
    const loadingStore = useLoadingStore()
    loadingStore.stopLoading()
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const loadingStore = useLoadingStore()
    loadingStore.stopLoading()

    // 请求完成，移除AbortController
    const requestKey = (response.config as any).requestKey
    if (requestKey) {
      abortControllers.delete(requestKey)
    }

    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res as any
  },
  (error) => {
    const loadingStore = useLoadingStore()
    loadingStore.stopLoading()

    // 请求完成，移除AbortController
    const requestKey = (error.config as any).requestKey
    if (requestKey) {
      abortControllers.delete(requestKey)
    }

    // 处理取消请求的情况
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message)
      return Promise.reject(error)
    }

    const message = error.response?.data?.message || error.message || '网络错误'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 取消所有未完成的请求
export const cancelAllPendingRequests = (): void => {
  abortControllers.forEach((controller, key) => {
    controller.abort('Request canceled by user')
    abortControllers.delete(key)
  })
  const loadingStore = useLoadingStore()
  loadingStore.resetLoading()
}

// 扩展AxiosRequestConfig以支持showLoading配置
interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
}

export const request = {
  get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return service.get(url, config)
  },
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return service.post(url, data, config)
  },
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return service.put(url, data, config)
  },
  delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return service.delete(url, config)
  },
}

export default service
