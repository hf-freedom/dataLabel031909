import { request } from '@/utils/request'
import type { Api, PageResult, PageInfo, ApiResponse } from '@/types'
import { HttpMethod } from '@/types'

export interface ApiQuery extends PageInfo {
  name?: string
  method?: HttpMethod
  path?: string
  appId?: number
}

export interface ApiForm {
  id?: number
  name: string
  method: HttpMethod
  path: string
  appId: number
  remark: string
}

export interface ApiListResponse extends PageResult<Api> {}

export interface ApiAllResponse extends Array<Api> {}

export interface ApiDetailResponse extends Api {}

export interface ApiCreateResponse extends Api {}

export interface ApiUpdateResponse extends Api {}

export const apiApi = {
  getList(params: ApiQuery): Promise<ApiResponse<ApiListResponse>> {
    return request.get<ApiListResponse>('/api/list', { params })
  },

  getAll(appId?: number): Promise<ApiResponse<ApiAllResponse>> {
    return request.get<ApiAllResponse>('/api/all', { params: { appId } })
  },

  getDetail(id: number): Promise<ApiResponse<ApiDetailResponse>> {
    return request.get<ApiDetailResponse>(`/api/${id}`)
  },

  create(data: ApiForm): Promise<ApiResponse<ApiCreateResponse>> {
    return request.post<ApiCreateResponse>('/api', data)
  },

  update(data: ApiForm): Promise<ApiResponse<ApiUpdateResponse>> {
    return request.put<ApiUpdateResponse>('/api', data)
  },

  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/api/${id}`)
  },

  getRoles(id: number): Promise<ApiResponse<unknown>> {
    return request.get<unknown>(`/api/${id}/roles`)
  },
}
