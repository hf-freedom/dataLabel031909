import { request } from '@/utils/request'
import type { Role, PageResult, PageInfo, RoleType, UserStatus, DataScope, StatusUpdateRequest } from '@/types'

export interface RoleQuery extends PageInfo {
  name?: string
  code?: string
  type?: RoleType
  status?: UserStatus
}

export interface RoleForm {
  id?: number
  name: string
  code: string
  type: RoleType
  status: UserStatus
  remark: string
  menus: number[]
  apis: number[]
  dataScope: DataScope
  dataOrgs: number[]
}

export interface UpdateMenusRequest {
  id: number
  menuIds: number[]
}

export interface UpdateApisRequest {
  id: number
  apiIds: number[]
}

export interface UpdateDataScopeRequest {
  id: number
  dataScope: DataScope
  dataOrgs: number[]
}

export const roleApi = {
  getList(params: RoleQuery) {
    return request.get<PageResult<Role>>('/role/list', { params })
  },

  getAll() {
    return request.get<Role[]>('/role/all')
  },

  getDetail(id: number) {
    return request.get<Role>(`/role/${id}`)
  },

  create(data: RoleForm) {
    return request.post<Role>('/role', data)
  },

  update(data: RoleForm) {
    return request.put<Role>('/role', data)
  },

  delete(id: number) {
    return request.delete<void>(`/role/${id}`)
  },

  copy(id: number) {
    return request.post<Role>(`/role/${id}/copy`)
  },

  updateStatus(id: number, status: UserStatus) {
    return request.put<void>(`/role/${id}/status`, { id, status } as StatusUpdateRequest)
  },

  getMenus(id: number) {
    return request.get<number[]>(`/role/${id}/menus`)
  },

  getApis(id: number) {
    return request.get<number[]>(`/role/${id}/apis`)
  },

  updateMenus(id: number, menuIds: number[]) {
    return request.put<void>(`/role/${id}/menus`, { menuIds })
  },

  updateApis(id: number, apiIds: number[]) {
    return request.put<void>(`/role/${id}/apis`, { apiIds })
  },

  updateDataScope(id: number, dataScope: DataScope, dataOrgs: number[]) {
    return request.put<void>(`/role/${id}/data-scope`, { dataScope, dataOrgs })
  },

  getUsers(id: number) {
    return request.get<User[]>(`/role/${id}/users`)
  },
}
