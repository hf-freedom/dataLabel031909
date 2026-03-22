import { request } from '@/utils/request'
import type {
  Role,
  PageResult,
  RoleQuery,
  RoleForm,
  UpdateRoleMenusRequest,
  UpdateRoleApisRequest,
  UpdateDataScopeRequest,
  UpdateStatusRequest,
  ApiResponse,
} from '@/types'

/**
 * 角色管理 API
 */
export const roleApi = {
  /**
   * 获取角色列表（分页）
   */
  getList(params: RoleQuery): Promise<ApiResponse<PageResult<Role>>> {
    return request.get<PageResult<Role>>('/role/list', { params })
  },

  /**
   * 获取所有角色
   */
  getAll(): Promise<ApiResponse<Role[]>> {
    return request.get<Role[]>('/role/all')
  },

  /**
   * 获取角色详情
   */
  getDetail(id: number): Promise<ApiResponse<Role>> {
    return request.get<Role>(`/role/${id}`)
  },

  /**
   * 创建角色
   */
  create(data: RoleForm): Promise<ApiResponse<Role>> {
    return request.post<Role>('/role', data)
  },

  /**
   * 更新角色
   */
  update(data: RoleForm): Promise<ApiResponse<Role>> {
    return request.put<Role>('/role', data)
  },

  /**
   * 删除角色
   */
  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/role/${id}`)
  },

  /**
   * 复制角色
   */
  copy(id: number): Promise<ApiResponse<Role>> {
    return request.post<Role>(`/role/${id}/copy`)
  },

  /**
   * 更新角色状态
   */
  updateStatus(id: number, status: number): Promise<ApiResponse<void>> {
    const data: UpdateStatusRequest = { status }
    return request.put<void>(`/role/${id}/status`, data)
  },

  /**
   * 获取角色的菜单权限
   */
  getMenus(id: number): Promise<ApiResponse<number[]>> {
    return request.get<number[]>(`/role/${id}/menus`)
  },

  /**
   * 获取角色的 API 权限
   */
  getApis(id: number): Promise<ApiResponse<number[]>> {
    return request.get<number[]>(`/role/${id}/apis`)
  },

  /**
   * 更新角色的菜单权限
   */
  updateMenus(id: number, menuIds: number[]): Promise<ApiResponse<void>> {
    const data: UpdateRoleMenusRequest = { menuIds }
    return request.put<void>(`/role/${id}/menus`, data)
  },

  /**
   * 更新角色的 API 权限
   */
  updateApis(id: number, apiIds: number[]): Promise<ApiResponse<void>> {
    const data: UpdateRoleApisRequest = { apiIds }
    return request.put<void>(`/role/${id}/apis`, data)
  },

  /**
   * 更新角色的数据权限范围
   */
  updateDataScope(
    id: number,
    dataScope: number,
    dataOrgs: number[]
  ): Promise<ApiResponse<void>> {
    const data: UpdateDataScopeRequest = { dataScope, dataOrgs }
    return request.put<void>(`/role/${id}/data-scope`, data)
  },

  /**
   * 获取角色下的用户
   */
  getUsers(id: number): Promise<ApiResponse<unknown[]>> {
    return request.get<unknown[]>(`/role/${id}/users`)
  },
}
