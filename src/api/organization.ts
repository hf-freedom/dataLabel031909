import { request } from '@/utils/request'
import type { Organization, ApiResponse } from '@/types'
import { OrganizationStatus, OrganizationType } from '@/types'

export interface OrganizationForm {
  id?: number
  name: string
  code: string
  sort: number
  type: OrganizationType
  leader: string
  phone: string
  status: OrganizationStatus
  parentId: number | null
}

export interface OrganizationTreeResponse extends Array<Organization> {}

export interface OrganizationDetailResponse extends Organization {}

export interface OrganizationCreateResponse extends Organization {}

export interface OrganizationUpdateResponse extends Organization {}

export interface OrganizationUpdateSortRequest {
  sort: number
}

export interface OrganizationMoveNodeRequest {
  parentId: number | null
}

export const organizationApi = {
  getTree(): Promise<ApiResponse<OrganizationTreeResponse>> {
    return request.get<OrganizationTreeResponse>('/organization/tree')
  },

  getDetail(id: number): Promise<ApiResponse<OrganizationDetailResponse>> {
    return request.get<OrganizationDetailResponse>(`/organization/${id}`)
  },

  create(data: OrganizationForm): Promise<ApiResponse<OrganizationCreateResponse>> {
    return request.post<OrganizationCreateResponse>('/organization', data)
  },

  update(data: OrganizationForm): Promise<ApiResponse<OrganizationUpdateResponse>> {
    return request.put<OrganizationUpdateResponse>('/organization', data)
  },

  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/organization/${id}`)
  },

  updateSort(id: number, sort: number): Promise<ApiResponse<void>> {
    return request.put<void>(`/organization/${id}/sort`, { sort } as OrganizationUpdateSortRequest)
  },

  moveNode(id: number, parentId: number | null): Promise<ApiResponse<void>> {
    return request.put<void>(`/organization/${id}/move`, { parentId } as OrganizationMoveNodeRequest)
  },

  getUsers(id: number): Promise<ApiResponse<unknown>> {
    return request.get<unknown>(`/organization/${id}/users`)
  },
}
