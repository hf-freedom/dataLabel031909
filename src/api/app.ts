import { request } from '@/utils/request'
import type {
  App,
  PageResult,
  AppQuery,
  AppForm,
  BindAppOrgsRequest,
  UpdateStatusRequest,
  ApiResponse,
} from '@/types'

/**
 * 应用管理 API
 */
export const appApi = {
  /**
   * 获取应用列表（分页）
   */
  getList(params: AppQuery): Promise<ApiResponse<PageResult<App>>> {
    return request.get<PageResult<App>>('/app/list', { params })
  },

  /**
   * 获取所有应用
   */
  getAll(): Promise<ApiResponse<App[]>> {
    return request.get<App[]>('/app/all')
  },

  /**
   * 获取应用详情
   */
  getDetail(id: number): Promise<ApiResponse<App>> {
    return request.get<App>(`/app/${id}`)
  },

  /**
   * 创建应用
   */
  create(data: AppForm): Promise<ApiResponse<App>> {
    return request.post<App>('/app', data)
  },

  /**
   * 更新应用
   */
  update(data: AppForm): Promise<ApiResponse<App>> {
    return request.put<App>('/app', data)
  },

  /**
   * 删除应用
   */
  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/app/${id}`)
  },

  /**
   * 更新应用状态
   */
  updateStatus(id: number, status: number): Promise<ApiResponse<void>> {
    const data: UpdateStatusRequest = { status }
    return request.put<void>(`/app/${id}/status`, data)
  },

  /**
   * 绑定组织机构
   */
  bindOrganizations(id: number, orgIds: number[]): Promise<ApiResponse<void>> {
    const data: BindAppOrgsRequest = { orgIds }
    return request.put<void>(`/app/${id}/organizations`, data)
  },
}
