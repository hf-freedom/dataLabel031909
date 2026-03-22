// 用户状态枚举
export enum UserStatus {
  DISABLED = 0,
  ENABLED = 1,
}

// 菜单类型枚举
export enum MenuType {
  DIRECTORY = 1,
  MENU = 2,
  BUTTON = 3,
}

// API请求方法枚举
export enum ApiMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

// 角色类型枚举
export enum RoleType {
  SYSTEM = 1,
  CUSTOM = 2,
}

// 组织机构类型枚举
export enum OrganizationType {
  COMPANY = 1,
  DEPARTMENT = 2,
  TEAM = 3,
}

// 应用状态枚举
export enum AppStatus {
  DISABLED = 0,
  ENABLED = 1,
}

// 数据权限范围枚举
export enum DataScope {
  ALL = 1,
  CUSTOM = 2,
  SELF = 3,
  SELF_AND_CHILDREN = 4,
}

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

export interface Organization {
  id: number
  name: string
  code: string
  sort: number
  type: OrganizationType
  leader: string
  phone: string
  status: UserStatus
  parentId: number | null
  children?: Organization[]
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  name: string
  code: string
  type: RoleType
  status: UserStatus
  remark: string
  menus: number[]
  apis: number[]
  dataScope: DataScope
  dataOrgs: number[]
  createdAt: string
  updatedAt: string
}

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
  hidden: number
  status: UserStatus
  appId: number
  children?: Menu[]
  createdAt: string
  updatedAt: string
}

export interface Api {
  id: number
  name: string
  method: ApiMethod
  path: string
  appId: number
  remark: string
  createdAt: string
  updatedAt: string
}

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

export interface PageInfo {
  page: number
  pageSize: number
  total?: number
}

export interface PageResult<T> {
  list: T[]
  page: number
  pageSize: number
  total: number
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 认证相关类型
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  userInfo: User
  permissions: string[]
}

// 通用状态类型
export interface StatusUpdateRequest {
  id: number
  status: number
}
