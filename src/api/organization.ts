import { request } from '@/utils/request'
import type { Organization, OrganizationType, UserStatus, User } from '@/types'

export interface OrganizationForm {
  id?: number
  name: string
  code: string
  sort: number
  type: OrganizationType
  leader: string
  phone: string
  status: UserStatus
  parentId: number | null
}

export interface UpdateSortRequest {
  id: number
  sort: number
}

export interface MoveNodeRequest {
  id: number
  parentId: number | null
}

export const organizationApi = {
  getTree() {
    return request.get<Organization[]>('/organization/tree')
  },

  getDetail(id: number) {
    return request.get<Organization>(`/organization/${id}`)
  },

  create(data: OrganizationForm) {
    return request.post<Organization>('/organization', data)
  },

  update(data: OrganizationForm) {
    return request.put<Organization>('/organization', data)
  },

  delete(id: number) {
    return request.delete<void>(`/organization/${id}`)
  },

  updateSort(id: number, sort: number) {
    return request.put<void>(`/organization/${id}/sort`, { id, sort } as UpdateSortRequest)
  },

  moveNode(id: number, parentId: number | null) {
    return request.put<void>(`/organization/${id}/move`, { id, parentId } as MoveNodeRequest)
  },

  getUsers(id: number) {
    return request.get<User[]>(`/organization/${id}/users`)
  },
}
