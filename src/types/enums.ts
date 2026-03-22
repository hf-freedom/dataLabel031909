export enum UserStatus {
  Disabled = 0,
  Enabled = 1,
}

export enum OrganizationStatus {
  Disabled = 0,
  Enabled = 1,
}

export enum OrganizationType {
  Company = 1,
  Department = 2,
  Group = 3,
}

export enum RoleStatus {
  Disabled = 0,
  Enabled = 1,
}

export enum RoleType {
  System = 1,
  Custom = 2,
}

export enum MenuType {
  Directory = 1,
  Menu = 2,
  Button = 3,
}

export enum MenuStatus {
  Disabled = 0,
  Enabled = 1,
}

export enum MenuHidden {
  Visible = 0,
  Hidden = 1,
}

export enum AppStatus {
  Disabled = 0,
  Enabled = 1,
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export enum DataScope {
  All = 1,
  Custom = 2,
  Department = 3,
  DepartmentAndBelow = 4,
  Self = 5,
}

export enum ApiCode {
  Success = 200,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
}

export const UserStatusLabels: Record<UserStatus, string> = {
  [UserStatus.Disabled]: '禁用',
  [UserStatus.Enabled]: '启用',
}

export const OrganizationTypeLabels: Record<OrganizationType, string> = {
  [OrganizationType.Company]: '公司',
  [OrganizationType.Department]: '部门',
  [OrganizationType.Group]: '小组',
}

export const RoleTypeLabels: Record<RoleType, string> = {
  [RoleType.System]: '系统角色',
  [RoleType.Custom]: '自定义角色',
}

export const MenuTypeLabels: Record<MenuType, string> = {
  [MenuType.Directory]: '目录',
  [MenuType.Menu]: '菜单',
  [MenuType.Button]: '按钮',
}

export const HttpMethodLabels: Record<HttpMethod, string> = {
  [HttpMethod.GET]: 'GET',
  [HttpMethod.POST]: 'POST',
  [HttpMethod.PUT]: 'PUT',
  [HttpMethod.DELETE]: 'DELETE',
  [HttpMethod.PATCH]: 'PATCH',
}

export const DataScopeLabels: Record<DataScope, string> = {
  [DataScope.All]: '全部数据',
  [DataScope.Custom]: '自定义数据',
  [DataScope.Department]: '本部门数据',
  [DataScope.DepartmentAndBelow]: '本部门及以下数据',
  [DataScope.Self]: '仅本人数据',
}
