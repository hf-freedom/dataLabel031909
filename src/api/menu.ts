import { request } from '@/utils/request'
import type { Menu, ApiResponse } from '@/types'
import { MenuType, MenuStatus, MenuHidden } from '@/types'

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
  hidden: MenuHidden
  status: MenuStatus
  appId: number
}

export interface MenuTreeResponse extends Array<Menu> {}

export interface MenuDetailResponse extends Menu {}

export interface MenuCreateResponse extends Menu {}

export interface MenuUpdateResponse extends Menu {}

export interface MenuUpdateStatusRequest {
  status: MenuStatus
}

export const menuApi = {
  getTree(appId?: number): Promise<ApiResponse<MenuTreeResponse>> {
    return request.get<MenuTreeResponse>('/menu/tree', { params: { appId } })
  },

  getDetail(id: number): Promise<ApiResponse<MenuDetailResponse>> {
    return request.get<MenuDetailResponse>(`/menu/${id}`)
  },

  create(data: MenuForm): Promise<ApiResponse<MenuCreateResponse>> {
    return request.post<MenuCreateResponse>('/menu', data)
  },

  update(data: MenuForm): Promise<ApiResponse<MenuUpdateResponse>> {
    return request.put<MenuUpdateResponse>('/menu', data)
  },

  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/menu/${id}`)
  },

  updateStatus(id: number, status: MenuStatus): Promise<ApiResponse<void>> {
    return request.put<void>(`/menu/${id}/status`, { status } as MenuUpdateStatusRequest)
  },
}
