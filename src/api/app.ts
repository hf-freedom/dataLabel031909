import { request } from '@/utils/request'
import type { App, PageResult, PageInfo, ApiResponse } from '@/types'
import { AppStatus } from '@/types'

export interface AppQuery extends PageInfo {
  name?: string
  code?: string
  status?: AppStatus
}

export interface AppForm {
  id?: number
  name: string
  code: string
  dbConfig: string
  status: AppStatus
  remark: string
  organizations: number[]
}

export interface AppListResponse extends PageResult<App> {}

export interface AppAllResponse extends Array<App> {}

export interface AppDetailResponse extends App {}

export interface AppCreateResponse extends App {}

export interface AppUpdateResponse extends App {}

export interface AppUpdateStatusRequest {
  status: AppStatus
}

export interface AppBindOrganizationsRequest {
  orgIds: number[]
}

export const appApi = {
  getList(params: AppQuery): Promise<ApiResponse<AppListResponse>> {
    return request.get<AppListResponse>('/app/list', { params })
  },

  getAll(): Promise<ApiResponse<AppAllResponse>> {
    return request.get<AppAllResponse>('/app/all')
  },

  getDetail(id: number): Promise<ApiResponse<AppDetailResponse>> {
    return request.get<AppDetailResponse>(`/app/${id}`)
  },

  create(data: AppForm): Promise<ApiResponse<AppCreateResponse>> {
    return request.post<AppCreateResponse>('/app', data)
  },

  update(data: AppForm): Promise<ApiResponse<AppUpdateResponse>> {
    return request.put<AppUpdateResponse>('/app', data)
  },

  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/app/${id}`)
  },

  updateStatus(id: number, status: AppStatus): Promise<ApiResponse<void>> {
    return request.put<void>(`/app/${id}/status`, { status } as AppUpdateStatusRequest)
  },

  bindOrganizations(id: number, orgIds: number[]): Promise<ApiResponse<void>> {
    return request.put<void>(`/app/${id}/organizations`, { orgIds } as AppBindOrganizationsRequest)
  },
}
