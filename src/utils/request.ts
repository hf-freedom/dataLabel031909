import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types'
import { ApiCode } from '@/types'

const pendingRequests = new Map<string, AbortController>()

function generateRequestKey(config: InternalAxiosRequestConfig): string {
  const { method, url } = config
  return `${method}-${url}`
}

function addPendingRequest(config: InternalAxiosRequestConfig): void {
  const key = generateRequestKey(config)
  if (pendingRequests.has(key)) {
    const controller = pendingRequests.get(key)
    controller?.abort()
  }
  const controller = new AbortController()
  config.signal = controller.signal
  pendingRequests.set(key, controller)
}

function removePendingRequest(config: InternalAxiosRequestConfig): void {
  const key = generateRequestKey(config)
  pendingRequests.delete(key)
}

export function cancelAllPendingRequests(): void {
  pendingRequests.forEach((controller) => {
    controller.abort()
  })
  pendingRequests.clear()
}

export function cancelPendingRequest(method: string, url: string): void {
  const key = `${method}-${url}`
  const controller = pendingRequests.get(key)
  if (controller) {
    controller.abort()
    pendingRequests.delete(key)
  }
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    addPendingRequest(config)
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    removePendingRequest(response.config as InternalAxiosRequestConfig)
    
    const res = response.data
    if (res.code !== ApiCode.Success) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res as unknown as AxiosResponse<ApiResponse>
  },
  (error) => {
    if (error.config) {
      removePendingRequest(error.config as InternalAxiosRequestConfig)
    }
    
    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      return Promise.reject(new Error('请求已取消'))
    }
    
    const status = error.response?.status
    let message = error.response?.data?.message || error.message || '网络错误'
    
    switch (status) {
      case ApiCode.Unauthorized:
        message = '登录已过期，请重新登录'
        localStorage.removeItem('token')
        window.location.href = '/login'
        break
      case ApiCode.Forbidden:
        message = '没有权限访问该资源'
        break
      case ApiCode.NotFound:
        message = '请求的资源不存在'
        break
      case ApiCode.ServerError:
        message = '服务器错误，请稍后重试'
        break
    }
    
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export interface RequestOptions extends AxiosRequestConfig {
  loadingKey?: string
  skipLoading?: boolean
}

export const request = {
  get<T = unknown>(url: string, config?: RequestOptions): Promise<ApiResponse<T>> {
    return service.get(url, config)
  },
  post<T = unknown>(url: string, data?: unknown, config?: RequestOptions): Promise<ApiResponse<T>> {
    return service.post(url, data, config)
  },
  put<T = unknown>(url: string, data?: unknown, config?: RequestOptions): Promise<ApiResponse<T>> {
    return service.put(url, data, config)
  },
  delete<T = unknown>(url: string, config?: RequestOptions): Promise<ApiResponse<T>> {
    return service.delete(url, config)
  },
}

export default service
