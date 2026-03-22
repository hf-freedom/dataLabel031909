import { request } from '@/utils/request'
import type {
  Organization,
  OrganizationForm,
  MoveNodeRequest,
  UpdateSortRequest,
  ApiResponse,
} from '@/types'

/**
 * 组织机构管理 API
 */
export const organizationApi = {
  /**
   * 获取组织机构树
   */
  getTree(): Promise<ApiResponse<Organization[]>> {
    return request.get<Organization[]>('/organization/tree')
  },

  /**
   * 获取组织机构详情
   */
  getDetail(id: number): Promise<ApiResponse<Organization>> {
    return request.get<Organization>(`/organization/${id}`)
  },

  /**
   * 创建组织机构
   */
  create(data: OrganizationForm): Promise<ApiResponse<Organization>> {
    return request.post<Organization>('/organization', data)
  },

  /**
   * 更新组织机构
   */
  update(data: OrganizationForm): Promise<ApiResponse<Organization>> {
    return request.put<Organization>('/organization', data)
  },

  /**
   * 删除组织机构
   */
  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/organization/${id}`)
  },

  /**
   * 更新排序
   */
  updateSort(id: number, sort: number): Promise<ApiResponse<void>> {
    const data: UpdateSortRequest = { sort }
    return request.put<void>(`/organization/${id}/sort`, data)
  },

  /**
   * 移动节点
   */
  moveNode(id: number, parentId: number | null): Promise<ApiResponse<void>> {
    const data: MoveNodeRequest = { parentId }
    return request.put<void>(`/organization/${id}/move`, data)
  },

  /**
   * 获取组织机构下的用户
   */
  getUsers(id: number): Promise<ApiResponse<unknown[]>> {
    return request.get<unknown[]>(`/organization/${id}/users`)
  },
}
