import { request } from '@/utils/request'
import type { Api, PageResult, ApiQuery, ApiForm, ApiResponse } from '@/types'

/**
 * API 权限管理 API
 */
export const apiApi = {
  /**
   * 获取 API 列表（分页）
   */
  getList(params: ApiQuery): Promise<ApiResponse<PageResult<Api>>> {
    return request.get<PageResult<Api>>('/api/list', { params })
  },

  /**
   * 获取所有 API
   */
  getAll(appId?: number): Promise<ApiResponse<Api[]>> {
    return request.get<Api[]>('/api/all', { params: appId ? { appId } : {} })
  },

  /**
   * 获取 API 详情
   */
  getDetail(id: number): Promise<ApiResponse<Api>> {
    return request.get<Api>(`/api/${id}`)
  },

  /**
   * 创建 API
   */
  create(data: ApiForm): Promise<ApiResponse<Api>> {
    return request.post<Api>('/api', data)
  },

  /**
   * 更新 API
   */
  update(data: ApiForm): Promise<ApiResponse<Api>> {
    return request.put<Api>('/api', data)
  },

  /**
   * 删除 API
   */
  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/api/${id}`)
  },

  /**
   * 获取 API 关联的角色
   */
  getRoles(id: number): Promise<ApiResponse<unknown[]>> {
    return request.get<unknown[]>(`/api/${id}/roles`)
  },
}
