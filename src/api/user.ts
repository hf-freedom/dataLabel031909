import { request } from '@/utils/request'
import type { User, PageResult, PageInfo, UserStatus, StatusUpdateRequest } from '@/types'

export interface UserQuery extends PageInfo {
  username?: string
  name?: string
  phone?: string
  status?: UserStatus
  orgId?: number
}

export interface UserForm {
  id?: number
  username: string
  name: string
  phone: string
  email: string
  status: UserStatus
  orgIds: number[]
  primaryOrgId: number | null
  roleIds: number[]
  password?: string
}

export interface BindRolesRequest {
  id: number
  roleIds: number[]
}

export interface BindOrgsRequest {
  id: number
  orgIds: number[]
  primaryOrgId: number | null
}

export const userApi = {
  getList(params: UserQuery) {
    return request.get<PageResult<User>>('/user/list', { params })
  },

  getDetail(id: number) {
    return request.get<User>(`/user/${id}`)
  },

  create(data: UserForm) {
    return request.post<User>('/user', data)
  },

  update(data: UserForm) {
    return request.put<User>('/user', data)
  },

  delete(id: number) {
    return request.delete<void>(`/user/${id}`)
  },

  updateStatus(id: number, status: UserStatus) {
    return request.put<void>(`/user/${id}/status`, { status } as StatusUpdateRequest)
  },

  resetPassword(id: number) {
    return request.put<void>(`/user/${id}/reset-password`)
  },

  bindRoles(id: number, roleIds: number[]) {
    return request.put<void>(`/user/${id}/roles`, { roleIds })
  },

  bindOrgs(id: number, orgIds: number[], primaryOrgId: number | null) {
    return request.put<void>(`/user/${id}/organizations`, { orgIds, primaryOrgId })
  },
}
