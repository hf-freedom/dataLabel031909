import { request } from '@/utils/request'
import type { Organization } from '@/types'

export interface OrganizationForm {
  id?: number
  name: string
  code: string
  sort: number
  type: number
  leader: string
  phone: string
  status: number
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
    return request.delete(`/organization/${id}`)
  },

  updateSort(id: number, sort: number) {
    return request.put(`/organization/${id}/sort`, { sort })
  },

  moveNode(id: number, parentId: number | null) {
    return request.put(`/organization/${id}/move`, { parentId })
  },

  getUsers(id: number) {
    return request.get(`/organization/${id}/users`)
  },
}
