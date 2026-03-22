import { request } from '@/utils/request'
import type { App, PageResult, PageInfo, AppStatus, StatusUpdateRequest } from '@/types'

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

export interface BindOrganizationsRequest {
  id: number
  orgIds: number[]
}

export const appApi = {
  getList(params: AppQuery) {
    return request.get<PageResult<App>>('/app/list', { params })
  },

  getAll() {
    return request.get<App[]>('/app/all')
  },

  getDetail(id: number) {
    return request.get<App>(`/app/${id}`)
  },

  create(data: AppForm) {
    return request.post<App>('/app', data)
  },

  update(data: AppForm) {
    return request.put<App>('/app', data)
  },

  delete(id: number) {
    return request.delete<void>(`/app/${id}`)
  },

  updateStatus(id: number, status: AppStatus) {
    return request.put<void>(`/app/${id}/status`, { id, status } as StatusUpdateRequest)
  },

  bindOrganizations(id: number, orgIds: number[]) {
    return request.put<void>(`/app/${id}/organizations`, { orgIds })
  },
}
