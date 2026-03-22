import type {
  UserStatus,
  OrganizationType,
  OrganizationStatus,
  RoleType,
  RoleStatus,
  DataScope,
  MenuType,
  MenuStatus,
  MenuHidden,
  HttpMethod,
  ApiStatus,
  AppStatus,
} from './enums'

// ==================== 通用类型 ====================

/**
 * 分页查询参数
 */
export interface PageInfo {
  page: number
  pageSize: number
}

/**
 * 分页查询结果
 */
export interface PageResult<T> {
  list: T[]
  page: number
  pageSize: number
  total: number
}

/**
 * API 统一响应结构
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// ==================== 用户模块 ====================

/**
 * 用户实体
 */
export interface User {
  id: number
  username: string
  name: string
  phone: string
  email: string
  status: UserStatus
  organizations: Organization[]
  primaryOrgId: number | null
  roles: Role[]
  createdAt: string
  updatedAt: string
}

/**
 * 用户查询参数
 */
export interface UserQuery extends PageInfo {
  username?: string
  name?: string
  phone?: string
  status?: UserStatus
  orgId?: number
}

/**
 * 用户表单数据
 */
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

/**
 * 用户登录请求
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * 用户登录响应
 */
export interface LoginResponse {
  token: string
  userInfo: User
  permissions: string[]
  menus: Menu[]
}

/**
 * 用户绑定角色请求
 */
export interface BindRolesRequest {
  roleIds: number[]
}

/**
 * 用户绑定机构请求
 */
export interface BindOrgsRequest {
  orgIds: number[]
  primaryOrgId: number | null
}

/**
 * 修改密码请求
 */
export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

/**
 * 重置密码响应
 */
export interface ResetPasswordResponse {
  defaultPassword: string
}

// ==================== 组织机构模块 ====================

/**
 * 组织机构实体
 */
export interface Organization {
  id: number
  name: string
  code: string
  sort: number
  type: OrganizationType
  leader: string
  phone: string
  status: OrganizationStatus
  parentId: number | null
  children?: Organization[]
  createdAt: string
  updatedAt: string
}

/**
 * 组织机构表单数据
 */
export interface OrganizationForm {
  id?: number
  name: string
  code: string
  sort: number
  type: OrganizationType
  leader: string
  phone: string
  status: OrganizationStatus
  parentId: number | null
}

/**
 * 移动节点请求
 */
export interface MoveNodeRequest {
  parentId: number | null
}

/**
 * 更新排序请求
 */
export interface UpdateSortRequest {
  sort: number
}

// ==================== 角色模块 ====================

/**
 * 角色实体
 */
export interface Role {
  id: number
  name: string
  code: string
  type: RoleType
  status: RoleStatus
  remark: string
  menus: number[]
  apis: number[]
  dataScope: DataScope
  dataOrgs: number[]
  createdAt: string
  updatedAt: string
}

/**
 * 角色查询参数
 */
export interface RoleQuery extends PageInfo {
  name?: string
  code?: string
  type?: RoleType
  status?: RoleStatus
}

/**
 * 角色表单数据
 */
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

/**
 * 更新角色菜单请求
 */
export interface UpdateRoleMenusRequest {
  menuIds: number[]
}

/**
 * 更新角色API请求
 */
export interface UpdateRoleApisRequest {
  apiIds: number[]
}

/**
 * 更新数据权限请求
 */
export interface UpdateDataScopeRequest {
  dataScope: DataScope
  dataOrgs: number[]
}

// ==================== 菜单模块 ====================

/**
 * 菜单实体
 */
export interface Menu {
  id: number
  name: string
  type: MenuType
  parentId: number | null
  path: string
  component: string
  permission: string
  icon: string
  sort: number
  hidden: MenuHidden
  status: MenuStatus
  appId: number
  children?: Menu[]
  createdAt: string
  updatedAt: string
}

/**
 * 菜单表单数据
 */
export interface MenuForm {
  id?: number
  name: string
  type: MenuType
  parentId: number | null
  path: string
  component: string
  permission: string
  icon: string
  sort: number
  hidden: MenuHidden
  status: MenuStatus
  appId: number
}

/**
 * 菜单树查询参数
 */
export interface MenuTreeQuery {
  appId?: number
}

// ==================== API 权限模块 ====================

/**
 * API 权限实体
 */
export interface Api {
  id: number
  name: string
  method: HttpMethod
  path: string
  appId: number
  remark: string
  createdAt: string
  updatedAt: string
}

/**
 * API 查询参数
 */
export interface ApiQuery extends PageInfo {
  name?: string
  method?: HttpMethod
  path?: string
  appId?: number
}

/**
 * API 表单数据
 */
export interface ApiForm {
  id?: number
  name: string
  method: HttpMethod
  path: string
  appId: number
  remark: string
}

// ==================== 应用模块 ====================

/**
 * 应用实体
 */
export interface App {
  id: number
  name: string
  code: string
  dbConfig: string
  status: AppStatus
  remark: string
  organizations: number[]
  createdAt: string
  updatedAt: string
}

/**
 * 应用查询参数
 */
export interface AppQuery extends PageInfo {
  name?: string
  code?: string
  status?: AppStatus
}

/**
 * 应用表单数据
 */
export interface AppForm {
  id?: number
  name: string
  code: string
  dbConfig: string
  status: AppStatus
  remark: string
  organizations: number[]
}

/**
 * 应用绑定机构请求
 */
export interface BindAppOrgsRequest {
  orgIds: number[]
}

/**
 * 更新状态请求
 */
export interface UpdateStatusRequest {
  status: number
}
