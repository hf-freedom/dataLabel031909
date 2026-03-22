import { request } from '@/utils/request'
import type { User, PageResult, PageInfo, ApiResponse } from '@/types'
import { UserStatus } from '@/types'

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

export interface UserListResponse extends PageResult<User> {}

export interface UserDetailResponse extends User {}

export interface UserCreateResponse extends User {}

export interface UserUpdateResponse extends User {}

export interface UserUpdateStatusRequest {
  status: UserStatus
}

export interface UserBindRolesRequest {
  roleIds: number[]
}

export interface UserBindOrgsRequest {
  orgIds: number[]
  primaryOrgId: number | null
}

export const userApi = {
  getList(params: UserQuery): Promise<ApiResponse<UserListResponse>> {
    return request.get<UserListResponse>('/user/list', { params })
  },

  getDetail(id: number): Promise<ApiResponse<UserDetailResponse>> {
    return request.get<UserDetailResponse>(`/user/${id}`)
  },

  create(data: UserForm): Promise<ApiResponse<UserCreateResponse>> {
    return request.post<UserCreateResponse>('/user', data)
  },

  update(data: UserForm): Promise<ApiResponse<UserUpdateResponse>> {
    return request.put<UserUpdateResponse>('/user', data)
  },

  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/user/${id}`)
  },

  updateStatus(id: number, status: UserStatus): Promise<ApiResponse<void>> {
    return request.put<void>(`/user/${id}/status`, { status } as UserUpdateStatusRequest)
  },

  resetPassword(id: number): Promise<ApiResponse<void>> {
    return request.put<void>(`/user/${id}/reset-password`)
  },

  bindRoles(id: number, roleIds: number[]): Promise<ApiResponse<void>> {
    return request.put<void>(`/user/${id}/roles`, { roleIds } as UserBindRolesRequest)
  },

  bindOrgs(id: number, orgIds: number[], primaryOrgId: number | null): Promise<ApiResponse<void>> {
    return request.put<void>(`/user/${id}/organizations`, { orgIds, primaryOrgId } as UserBindOrgsRequest)
  },
}
