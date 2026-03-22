import { request } from '@/utils/request'
import type { Menu, MenuForm, MenuTreeQuery, ApiResponse } from '@/types'

/**
 * 菜单管理 API
 */
export const menuApi = {
  /**
   * 获取菜单树
   */
  getTree(appId?: number): Promise<ApiResponse<Menu[]>> {
    const params: MenuTreeQuery = appId ? { appId } : {}
    return request.get<Menu[]>('/menu/tree', { params })
  },

  /**
   * 获取菜单详情
   */
  getDetail(id: number): Promise<ApiResponse<Menu>> {
    return request.get<Menu>(`/menu/${id}`)
  },

  /**
   * 创建菜单
   */
  create(data: MenuForm): Promise<ApiResponse<Menu>> {
    return request.post<Menu>('/menu', data)
  },

  /**
   * 更新菜单
   */
  update(data: MenuForm): Promise<ApiResponse<Menu>> {
    return request.put<Menu>('/menu', data)
  },

  /**
   * 删除菜单
   */
  delete(id: number): Promise<ApiResponse<void>> {
    return request.delete<void>(`/menu/${id}`)
  },

  /**
   * 更新菜单状态
   */
  updateStatus(id: number, status: number): Promise<ApiResponse<void>> {
    return request.put<void>(`/menu/${id}/status`, { status })
  },
}
