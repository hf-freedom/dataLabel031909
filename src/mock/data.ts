import Mock from 'mockjs'

const Random = Mock.Random

const generateId = () => Random.increment()

const generateTree = (parentId: number | null = null, level = 0): any[] => {
  if (level > 2) return []
  
  const count = level === 0 ? 3 : Random.integer(2, 4)
  const result = []
  
  for (let i = 0; i < count; i++) {
    const id = generateId()
    result.push({
      id,
      name: Random.cname() + (level === 0 ? '公司' : level === 1 ? '部门' : '小组'),
      code: `ORG_${id}`,
      sort: i,
      type: level + 1,
      leader: Random.cname(),
      phone: /^1[3-9]\d{9}$/,
      status: Random.pick([0, 1]),
      parentId,
      children: generateTree(id, level + 1),
      createdAt: Random.datetime(),
      updatedAt: Random.datetime(),
    })
  }
  
  return result
}

export const mockOrganizations = generateTree()

export const mockRoles = [
  {
    id: 1,
    name: '超级管理员',
    code: 'super_admin',
    type: 1,
    status: 1,
    remark: '系统内置角色，拥有所有权限',
    menus: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    apis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    dataScope: 4,
    dataOrgs: [1, 2, 3, 4, 5],
    createdAt: Random.datetime(),
    updatedAt: Random.datetime(),
  },
  {
    id: 2,
    name: '管理员',
    code: 'admin',
    type: 1,
    status: 1,
    remark: '系统内置角色，拥有部分权限',
    menus: [1, 2, 3, 4, 5],
    apis: [1, 2, 3, 4, 5],
    dataScope: 2,
    dataOrgs: [],
    createdAt: Random.datetime(),
    updatedAt: Random.datetime(),
  },
  {
    id: 3,
    name: '普通用户',
    code: 'user',
    type: 2,
    status: 1,
    remark: '自定义角色',
    menus: [1, 2],
    apis: [1, 2],
    dataScope: 1,
    dataOrgs: [],
    createdAt: Random.datetime(),
    updatedAt: Random.datetime(),
  },
]

export const mockUsers = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  username: `user${i + 1}`,
  name: Random.cname(),
  phone: /^1[3-9]\d{9}$/,
  email: Random.email(),
  status: Random.pick([0, 1]),
  organizations: [
    { id: Random.integer(1, 5), name: Random.cname() + '部门' },
  ],
  primaryOrgId: Random.integer(1, 5),
  roles: [
    mockRoles[Random.integer(0, 2)],
  ],
  createdAt: Random.datetime(),
  updatedAt: Random.datetime(),
}))

export const mockMenus = [
  {
    id: 1,
    name: '首页',
    type: 2,
    parentId: null,
    path: '/dashboard',
    component: '/views/dashboard/index.vue',
    permission: 'dashboard',
    icon: 'HomeFilled',
    sort: 0,
    hidden: 0,
    status: 1,
    appId: 1,
    createdAt: Random.datetime(),
    updatedAt: Random.datetime(),
  },
  {
    id: 2,
    name: '系统管理',
    type: 1,
    parentId: null,
    path: '/system',
    component: '',
    permission: '',
    icon: 'Setting',
    sort: 1,
    hidden: 0,
    status: 1,
    appId: 1,
    children: [
      {
        id: 3,
        name: '用户管理',
        type: 2,
        parentId: 2,
        path: '/system/user',
        component: '/views/system/user/index.vue',
        permission: 'system:user:list',
        icon: 'User',
        sort: 0,
        hidden: 0,
        status: 1,
        appId: 1,
        children: [
          {
            id: 10,
            name: '新增用户',
            type: 3,
            parentId: 3,
            path: '',
            component: '',
            permission: 'system:user:add',
            icon: '',
            sort: 0,
            hidden: 0,
            status: 1,
            appId: 1,
          },
        ],
      },
      {
        id: 4,
        name: '组织机构',
        type: 2,
        parentId: 2,
        path: '/system/organization',
        component: '/views/system/organization/index.vue',
        permission: 'system:org:list',
        icon: 'OfficeBuilding',
        sort: 1,
        hidden: 0,
        status: 1,
        appId: 1,
      },
      {
        id: 5,
        name: '角色管理',
        type: 2,
        parentId: 2,
        path: '/system/role',
        component: '/views/system/role/index.vue',
        permission: 'system:role:list',
        icon: 'UserFilled',
        sort: 2,
        hidden: 0,
        status: 1,
        appId: 1,
      },
      {
        id: 6,
        name: '菜单管理',
        type: 2,
        parentId: 2,
        path: '/system/menu',
        component: '/views/system/menu/index.vue',
        permission: 'system:menu:list',
        icon: 'Menu',
        sort: 3,
        hidden: 0,
        status: 1,
        appId: 1,
      },
      {
        id: 7,
        name: 'API权限',
        type: 2,
        parentId: 2,
        path: '/system/api',
        component: '/views/system/api/index.vue',
        permission: 'system:api:list',
        icon: 'Connection',
        sort: 4,
        hidden: 0,
        status: 1,
        appId: 1,
      },
      {
        id: 8,
        name: '应用管理',
        type: 2,
        parentId: 2,
        path: '/system/app',
        component: '/views/system/app/index.vue',
        permission: 'system:app:list',
        icon: 'Grid',
        sort: 5,
        hidden: 0,
        status: 1,
        appId: 1,
      },
    ],
  },
]

export const mockApis = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: Random.pick(['获取列表', '新增', '编辑', '删除', '详情', '导出']) + Random.pick(['用户', '角色', '菜单', '组织', '应用']),
  method: Random.pick(['GET', 'POST', 'PUT', 'DELETE']),
  path: `/api/${Random.word()}/${Random.word()}`,
  appId: 1,
  remark: Random.csentence(),
  createdAt: Random.datetime(),
  updatedAt: Random.datetime(),
}))

export const mockApps = [
  {
    id: 1,
    name: '主应用',
    code: 'main_app',
    dbConfig: '',
    status: 1,
    remark: '主应用系统',
    organizations: [1, 2, 3],
    createdAt: Random.datetime(),
    updatedAt: Random.datetime(),
  },
  {
    id: 2,
    name: '子系统A',
    code: 'sub_app_a',
    dbConfig: JSON.stringify({ host: 'localhost', port: 3306, database: 'sub_a' }),
    status: 1,
    remark: '子系统A',
    organizations: [1, 2],
    createdAt: Random.datetime(),
    updatedAt: Random.datetime(),
  },
  {
    id: 3,
    name: '子系统B',
    code: 'sub_app_b',
    dbConfig: JSON.stringify({ host: 'localhost', port: 3306, database: 'sub_b' }),
    status: 0,
    remark: '子系统B',
    organizations: [3],
    createdAt: Random.datetime(),
    updatedAt: Random.datetime(),
  },
]
