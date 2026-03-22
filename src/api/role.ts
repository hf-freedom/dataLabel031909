import { request } from '@/utils/request'
import type { Role, PageResult, PageInfo, ApiResponse } from '@/types'
import { RoleStatus, RoleType, DataScope } from '@/types'

export interface RoleQuery extends PageInfo {
  name?: string
  code?: string
  type?: RoleType
  status?: RoleStatus
}

export interface RoleForm {
  id?: number
  name: string
  code: string
  type: RoleType
  status: RoleStatus
  remark: string
  menus: number[]
  apis: number[]
  dataScope: DataScope
  dataOrgs: number[]
}

export interface RoleListResponse extends PageResult<Role> {}

export interface RoleAllResponse extends Array<Role> {}

export interface RoleDetailResponse extends Role {}

export interface RoleCreateResponse extends Role {}

export interface RoleUpdateResponse extends Role {}

export interface RoleUpdateStatusRequest {
  status: RoleStatus
}

export interface RoleMenusResponse extends Array<number> {}

export interface RoleApisResponse extends Array<number> {}

export interface RoleUpdateMenusRequest {
  menuIds: number[]
}

export interface RoleUpdateApisRequest {
  apiIds: number[]
}

export interface RoleUpdateDataScopeRequest {
  dataScope: DataScope
  dataOrgs: number[]
}

export const roleApi = {
  getList(params: RoleQuery): Promise<ApiResponse<RoleListResponse>> {
    return request.get<RoleListResponse>('/role/list', { params })
  },

  getAll(): Promise<ApiResponse<RoleAllResponse>> {
    return request.get<RoleAllResponse>('/role/all')
  },

  getDetail(id: number): Promise<ApiResponse<RoleDetailResponse>> {
    return request.get<RoleDetailResponse>(`/role/${id}`)
  },

  create(data: RoleForm): Promise<ApiResponse<RoleCreateResponse>> {
    return request.post<RoleCreateResponse>('/role', data)
  },

  update(data: RoleForm): Promise<ApiResponse<RoleUpdateResponse>> {
    return request.put<RoleUpdateResponse>('/role', data)
  },

  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/role/${id}`)
  },

  copy(id: number): Promise<ApiResponse<RoleCreateResponse>> {
    return request.post<RoleCreateResponse>(`/role/${id}/copy`)
  },

  updateStatus(id: number, status: RoleStatus): Promise<ApiResponse<void>> {
    return request.put<void>(`/role/${id}/status`, { status } as RoleUpdateStatusRequest)
  },

  getMenus(id: number): Promise<ApiResponse<RoleMenusResponse>> {
    return request.get<RoleMenusResponse>(`/role/${id}/menus`)
  },

  getApis(id: number): Promise<ApiResponse<RoleApisResponse>> {
    return request.get<RoleApisResponse>(`/role/${id}/apis`)
  },

  updateMenus(id: number, menuIds: number[]): Promise<ApiResponse<void>> {
    return request.put<void>(`/role/${id}/menus`, { menuIds } as RoleUpdateMenusRequest)
  },

  updateApis(id: number, apiIds: number[]): Promise<ApiResponse<void>> {
    return request.put<void>(`/role/${id}/apis`, { apiIds } as RoleUpdateApisRequest)
  },

  updateDataScope(id: number, dataScope: DataScope, dataOrgs: number[]): Promise<ApiResponse<void>> {
    return request.put<void>(`/role/${id}/data-scope`, { dataScope, dataOrgs } as RoleUpdateDataScopeRequest)
  },

  getUsers(id: number): Promise<ApiResponse<unknown>> {
    return request.get<unknown>(`/role/${id}/users`)
  },
}
