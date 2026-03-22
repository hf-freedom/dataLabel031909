import { request } from '@/utils/request'
import type { Api, PageResult, PageInfo, ApiMethod, Role } from '@/types'

export interface ApiQuery extends PageInfo {
  name?: string
  method?: ApiMethod
  path?: string
  appId?: number
}

export interface ApiForm {
  id?: number
  name: string
  method: ApiMethod
  path: string
  appId: number
  remark: string
}

export interface GetAllApiQuery {
  appId?: number
}

export const apiApi = {
  getList(params: ApiQuery) {
    return request.get<PageResult<Api>>('/api/list', { params })
  },

  getAll(appId?: number) {
    return request.get<Api[]>('/api/all', { params: { appId } as GetAllApiQuery })
  },

  getDetail(id: number) {
    return request.get<Api>(`/api/${id}`)
  },

  create(data: ApiForm) {
    return request.post<Api>('/api', data)
  },

  update(data: ApiForm) {
    return request.put<Api>('/api', data)
  },

  delete(id: number) {
    return request.delete<void>(`/api/${id}`)
  },

  getRoles(id: number) {
    return request.get<Role[]>(`/api/${id}/roles`)
  },
}
