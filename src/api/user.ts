import { request } from '@/utils/request'
import type {
  User,
  PageResult,
  UserQuery,
  UserForm,
  LoginRequest,
  LoginResponse,
  BindRolesRequest,
  BindOrgsRequest,
  ResetPasswordResponse,
  UpdateStatusRequest,
  ApiResponse,
} from '@/types'

/**
 * 用户管理 API
 */
export const userApi = {
  /**
   * 用户登录
   */
  login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return request.post<LoginResponse>('/auth/login', data)
  },

  /**
   * 获取当前登录用户信息
   */
  getCurrentUser(): Promise<ApiResponse<User>> {
    return request.get<User>('/auth/current')
  },

  /**
   * 获取用户列表（分页）
   */
  getList(params: UserQuery): Promise<ApiResponse<PageResult<User>>> {
    return request.get<PageResult<User>>('/user/list', { params })
  },

  /**
   * 获取用户详情
   */
  getDetail(id: number): Promise<ApiResponse<User>> {
    return request.get<User>(`/user/${id}`)
  },

  /**
   * 创建用户
   */
  create(data: UserForm): Promise<ApiResponse<User>> {
    return request.post<User>('/user', data)
  },

  /**
   * 更新用户
   */
  update(data: UserForm): Promise<ApiResponse<User>> {
    return request.put<User>('/user', data)
  },

  /**
   * 删除用户
   */
  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/user/${id}`)
  },

  /**
   * 更新用户状态
   */
  updateStatus(id: number, status: number): Promise<ApiResponse<void>> {
    const data: UpdateStatusRequest = { status }
    return request.put<void>(`/user/${id}/status`, data)
  },

  /**
   * 重置用户密码
   */
  resetPassword(id: number): Promise<ApiResponse<ResetPasswordResponse>> {
    return request.put<ResetPasswordResponse>(`/user/${id}/reset-password`)
  },

  /**
   * 绑定角色
   */
  bindRoles(id: number, roleIds: number[]): Promise<ApiResponse<void>> {
    const data: BindRolesRequest = { roleIds }
    return request.put<void>(`/user/${id}/roles`, data)
  },

  /**
   * 绑定组织机构
   */
  bindOrgs(
    id: number,
    orgIds: number[],
    primaryOrgId: number | null
  ): Promise<ApiResponse<void>> {
    const data: BindOrgsRequest = { orgIds, primaryOrgId }
    return request.put<void>(`/user/${id}/organizations`, data)
  },
}
