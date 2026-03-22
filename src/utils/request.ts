import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, CanceledError } from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import type { ApiResponse } from '@/types'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'

// 请求配置接口
interface RequestConfig extends AxiosRequestConfig {
  /** 是否显示 Loading */
  showLoading?: boolean
  /** Loading 文本 */
  loadingText?: string
  /** 是否允许重复请求（默认不允许） */
  allowDuplicate?: boolean
}

// 存储正在进行的请求
const pendingRequests = new Map<string, AbortController>()

// 生成请求唯一标识
const generateRequestKey = (config: AxiosRequestConfig): string => {
  const { url, method, params, data } = config
  return `${method?.toUpperCase()}_${url}_${JSON.stringify(params)}_${JSON.stringify(data)}`
}

// 添加请求到 pending
const addPendingRequest = (config: RequestConfig): AbortController => {
  const key = generateRequestKey(config)

  // 如果已存在相同请求，先取消
  if (pendingRequests.has(key)) {
    const controller = pendingRequests.get(key)
    controller?.abort()
    pendingRequests.delete(key)
  }

  const controller = new AbortController()
  config.signal = controller.signal
  pendingRequests.set(key, controller)
  return controller
}

// 移除 pending 请求
const removePendingRequest = (config: AxiosRequestConfig): void => {
  const key = generateRequestKey(config)
  pendingRequests.delete(key)
}

// 取消所有 pending 请求
export const cancelAllPendingRequests = (message?: string): void => {
  pendingRequests.forEach(controller => {
    controller.abort(message || '请求被取消')
  })
  pendingRequests.clear()
}

// Loading 管理
let loadingInstance: LoadingInstance | null = null
let loadingCount = 0

const showLoading = (text?: string): void => {
  loadingCount++
  if (loadingCount === 1) {
    loadingInstance = ElLoading.service({
      text: text || '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
}

const hideLoading = (): void => {
  loadingCount--
  if (loadingCount <= 0) {
    loadingCount = 0
    loadingInstance?.close()
    loadingInstance = null
  }
}

/**
 * 检查错误是否是请求取消
 * 兼容 axios 不同版本和 AbortController
 */
const isCancelError = (error: unknown): boolean => {
  // 检查 CanceledError (axios v1.x)
  if (error instanceof CanceledError) {
    return true
  }
  // 检查 axios.isCancel (axios v0.x 或某些情况)
  if (axios.isCancel && axios.isCancel(error)) {
    return true
  }
  // 检查 AbortError (原生 AbortController)
  if (error instanceof Error && error.name === 'AbortError') {
    return true
  }
  // 检查错误消息
  if (error instanceof Error) {
    const cancelMessages = ['canceled', 'cancelled', '请求被取消', 'abort', 'AbortError']
    return cancelMessages.some(msg => error.message?.toLowerCase().includes(msg.toLowerCase()))
  }
  return false
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config: RequestConfig) => {
    // 获取 Token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 处理重复请求
    if (!config.allowDuplicate) {
      addPendingRequest(config)
    }

    // 显示 Loading
    if (config.showLoading) {
      showLoading(config.loadingText)
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const config = response.config as RequestConfig

    // 移除 pending 请求
    if (!config.allowDuplicate) {
      removePendingRequest(config)
    }

    // 隐藏 Loading
    if (config.showLoading) {
      hideLoading()
    }

    const res = response.data

    // 业务错误处理
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res as AxiosResponse<ApiResponse<unknown>>
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const config = error.config as RequestConfig | undefined

    // 移除 pending 请求
    if (config && !config.allowDuplicate) {
      removePendingRequest(config)
    }

    // 隐藏 Loading
    if (config?.showLoading) {
      hideLoading()
    }

    // 取消请求不显示错误
    if (isCancelError(error)) {
      console.log('Request canceled:', (error as Error).message)
      return Promise.reject(error)
    }

    // 处理 HTTP 错误
    const message = error.response?.data?.message || error.message || '网络错误'
    ElMessage.error(message)

    return Promise.reject(error)
  }
)

/**
 * 封装请求方法
 */
export const request = {
  get<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return service.get(url, config) as Promise<ApiResponse<T>>
  },

  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return service.post(url, data, config) as Promise<ApiResponse<T>>
  },

  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return service.put(url, data, config) as Promise<ApiResponse<T>>
  },

  delete<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return service.delete(url, config) as Promise<ApiResponse<T>>
  },

  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return service.patch(url, data, config) as Promise<ApiResponse<T>>
  },
}

export default service
