import { request } from '@/utils/request'
import type { Menu } from '@/types'

export interface MenuForm {
  id?: number
  name: string
  type: number
  parentId: number | null
  path: string
  component: string
  permission: string
  icon: string
  sort: number
  hidden: number
  status: number
  appId: number
}

export const menuApi = {
  getTree(appId?: number) {
    return request.get<Menu[]>('/menu/tree', { params: { appId } })
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
    return request.delete(`/menu/${id}`)
  },

  updateStatus(id: number, status: number) {
    return request.put(`/menu/${id}/status`, { status })
  },
}
