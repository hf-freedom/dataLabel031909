import {
  UserStatus,
  OrganizationStatus,
  OrganizationType,
  RoleStatus,
  RoleType,
  MenuType,
  MenuStatus,
  MenuHidden,
  AppStatus,
  HttpMethod,
  DataScope,
} from './enums'

export * from './enums'

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
  status: OrganizationStatus
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
  status: RoleStatus
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
  hidden: MenuHidden
  status: MenuStatus
  appId: number
  children?: Menu[]
  createdAt: string
  updatedAt: string
}

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
  total: number
}

export interface PageResult<T> {
  list: T[]
  page: number
  pageSize: number
  total: number
}

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface UserInfoResponse {
  user: User
  menus: Menu[]
  permissions: string[]
}
