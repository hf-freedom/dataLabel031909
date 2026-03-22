/**
 * 用户状态枚举
 */
export enum UserStatus {
  Disabled = 0,
  Enabled = 1,
}

/**
 * 组织机构类型枚举
 */
export enum OrganizationType {
  Company = 1,
  Department = 2,
  Group = 3,
}

/**
 * 组织机构状态枚举
 */
export enum OrganizationStatus {
  Disabled = 0,
  Enabled = 1,
}

/**
 * 角色类型枚举
 */
export enum RoleType {
  System = 1,
  Custom = 2,
}

/**
 * 角色状态枚举
 */
export enum RoleStatus {
  Disabled = 0,
  Enabled = 1,
}

/**
 * 数据权限范围枚举
 */
export enum DataScope {
  All = 1,
  Custom = 2,
  Department = 3,
  DepartmentAndBelow = 4,
  Self = 5,
}

/**
 * 菜单类型枚举
 */
export enum MenuType {
  Directory = 1,
  Menu = 2,
  Button = 3,
}

/**
 * 菜单状态枚举
 */
export enum MenuStatus {
  Disabled = 0,
  Enabled = 1,
}

/**
 * 菜单隐藏状态枚举
 */
export enum MenuHidden {
  Visible = 0,
  Hidden = 1,
}

/**
 * HTTP 方法枚举
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

/**
 * API 权限状态枚举
 */
export enum ApiStatus {
  Disabled = 0,
  Enabled = 1,
}

/**
 * 应用状态枚举
 */
export enum AppStatus {
  Disabled = 0,
  Enabled = 1,
}
