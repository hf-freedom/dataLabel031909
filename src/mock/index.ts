import Mock from 'mockjs'
import type { ApiResponse } from '@/types'
import {
  mockOrganizations,
  mockRoles,
  mockUsers,
  mockMenus,
  mockApis,
  mockApps,
} from './data'

Mock.setup({
  timeout: '200-500',
})

const success = <T>(data: T): ApiResponse<T> => ({
  code: 200,
  message: 'success',
  data,
})

Mock.mock(/\/api\/organization\/tree/, 'get', () => success(mockOrganizations))

Mock.mock(/\/api\/role\/all/, 'get', () => success(mockRoles))

Mock.mock(/\/api\/role\/list/, 'get', (options: any) => {
  const { page = 1, pageSize = 10 } = JSON.parse(options.body || '{}')
  const start = (page - 1) * pageSize
  const list = mockRoles.slice(start, start + pageSize)
  return success({
    list,
    page,
    pageSize,
    total: mockRoles.length,
  })
})

Mock.mock(/\/api\/user\/list/, 'get', (options: any) => {
  const { page = 1, pageSize = 10 } = JSON.parse(options.body || '{}')
  const start = (page - 1) * pageSize
  const list = mockUsers.slice(start, start + pageSize)
  return success({
    list,
    page,
    pageSize,
    total: mockUsers.length,
  })
})

Mock.mock(/\/api\/menu\/tree/, 'get', () => success(mockMenus))

Mock.mock(/\/api\/api\/all/, 'get', () => success(mockApis))

Mock.mock(/\/api\/api\/list/, 'get', (options: any) => {
  const { page = 1, pageSize = 10 } = JSON.parse(options.body || '{}')
  const start = (page - 1) * pageSize
  const list = mockApis.slice(start, start + pageSize)
  return success({
    list,
    page,
    pageSize,
    total: mockApis.length,
  })
})

Mock.mock(/\/api\/app\/all/, 'get', () => success(mockApps))

Mock.mock(/\/api\/app\/list/, 'get', (options: any) => {
  const { page = 1, pageSize = 10 } = JSON.parse(options.body || '{}')
  const start = (page - 1) * pageSize
  const list = mockApps.slice(start, start + pageSize)
  return success({
    list,
    page,
    pageSize,
    total: mockApps.length,
  })
})

Mock.mock(/\/api\/.*/, 'post', () => success({}))
Mock.mock(/\/api\/.*/, 'put', () => success({}))
Mock.mock(/\/api\/.*/, 'delete', () => success({}))

export default Mock
