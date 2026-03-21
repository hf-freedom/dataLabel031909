export interface User {
  id: number
  username: string
  name: string
  phone: string
  email: string
  status: number
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
  type: number
  leader: string
  phone: string
  status: number
  parentId: number | null
  children?: Organization[]
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  name: string
  code: string
  type: number
  status: number
  remark: string
  menus: number[]
  apis: number[]
  dataScope: number
  dataOrgs: number[]
  createdAt: string
  updatedAt: string
}

export interface Menu {
  id: number
  name: string
  type: number
  parentId: number | null
  path: string
  component: string
  permission: string
  icon: string
  sort: number
  hidden: number
  status: number
  appId: number
  children?: Menu[]
  createdAt: string
  updatedAt: string
}

export interface Api {
  id: number
  name: string
  method: string
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
  status: number
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

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}
