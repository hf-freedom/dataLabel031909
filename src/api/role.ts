import { request } from '@/utils/request'
import type { Role, PageResult, PageInfo } from '@/types'

export interface RoleQuery extends PageInfo {
  name?: string
  code?: string
  type?: number
  status?: number
}

export interface RoleForm {
  id?: number
  name: string
  code: string
  type: number
  status: number
  remark: string
  menus: number[]
  apis: number[]
  dataScope: number
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
    return request.delete(`/role/${id}`)
  },

  copy(id: number) {
    return request.post<Role>(`/role/${id}/copy`)
  },

  updateStatus(id: number, status: number) {
    return request.put(`/role/${id}/status`, { status })
  },

  getMenus(id: number) {
    return request.get<number[]>(`/role/${id}/menus`)
  },

  getApis(id: number) {
    return request.get<number[]>(`/role/${id}/apis`)
  },

  updateMenus(id: number, menuIds: number[]) {
    return request.put(`/role/${id}/menus`, { menuIds })
  },

  updateApis(id: number, apiIds: number[]) {
    return request.put(`/role/${id}/apis`, { apiIds })
  },

  updateDataScope(id: number, dataScope: number, dataOrgs: number[]) {
    return request.put(`/role/${id}/data-scope`, { dataScope, dataOrgs })
  },

  getUsers(id: number) {
    return request.get(`/role/${id}/users`)
  },
}
