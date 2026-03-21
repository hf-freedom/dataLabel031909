import { request } from '@/utils/request'
import type { User, PageResult, PageInfo } from '@/types'

export interface UserQuery extends PageInfo {
  username?: string
  name?: string
  phone?: string
  status?: number
  orgId?: number
}

export interface UserForm {
  id?: number
  username: string
  name: string
  phone: string
  email: string
  status: number
  orgIds: number[]
  primaryOrgId: number | null
  roleIds: number[]
  password?: string
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
    return request.delete(`/user/${id}`)
  },

  updateStatus(id: number, status: number) {
    return request.put(`/user/${id}/status`, { status })
  },

  resetPassword(id: number) {
    return request.put(`/user/${id}/reset-password`)
  },

  bindRoles(id: number, roleIds: number[]) {
    return request.put(`/user/${id}/roles`, { roleIds })
  },

  bindOrgs(id: number, orgIds: number[], primaryOrgId: number | null) {
    return request.put(`/user/${id}/organizations`, { orgIds, primaryOrgId })
  },
}
