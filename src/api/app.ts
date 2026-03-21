import { request } from '@/utils/request'
import type { App, PageResult, PageInfo } from '@/types'

export interface AppQuery extends PageInfo {
  name?: string
  code?: string
  status?: number
}

export interface AppForm {
  id?: number
  name: string
  code: string
  dbConfig: string
  status: number
  remark: string
  organizations: number[]
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
    return request.delete(`/app/${id}`)
  },

  updateStatus(id: number, status: number) {
    return request.put(`/app/${id}/status`, { status })
  },

  bindOrganizations(id: number, orgIds: number[]) {
    return request.put(`/app/${id}/organizations`, { orgIds })
  },
}
