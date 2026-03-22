import { request } from '@/utils/request'
import type { Menu, MenuType, UserStatus, StatusUpdateRequest } from '@/types'

export interface MenuForm {
  id?: number
  name: string
  type: MenuType
  parentId: number | null
  path: string
  component: string
  permission: string
  icon: string
  sort: number
  hidden: number
  status: UserStatus
  appId: number
}

export interface MenuTreeQuery {
  appId?: number
}

export const menuApi = {
  getTree(appId?: number) {
    return request.get<Menu[]>('/menu/tree', { params: { appId } as MenuTreeQuery })
  },

  getDetail(id: number) {
    return request.get<Menu>(`/menu/${id}`)
  },

  create(data: MenuForm) {
    return request.post<Menu>('/menu', data)
  },

  update(data: MenuForm) {
    return request.put<Menu>('/menu', data)
  },

  delete(id: number) {
    return request.delete<void>(`/menu/${id}`)
  },

  updateStatus(id: number, status: UserStatus) {
    return request.put<void>(`/menu/${id}/status`, { id, status } as StatusUpdateRequest)
  },
}
