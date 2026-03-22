import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import Layout from '@/layouts/Index.vue'
import { cancelAllPendingRequests } from '@/utils/request'
import { useAuthStore } from '@/stores'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true },
  },
]

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' },
      },
    ],
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'User', permission: 'system:user:list' },
      },
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/system/organization/index.vue'),
        meta: { title: '组织机构', icon: 'OfficeBuilding', permission: 'system:org:list' },
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'UserFilled', permission: 'system:role:list' },
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理', icon: 'Menu', permission: 'system:menu:list' },
      },
      {
        path: 'api',
        name: 'Api',
        component: () => import('@/views/system/api/index.vue'),
        meta: { title: 'API权限', icon: 'Connection', permission: 'system:api:list' },
      },
      {
        path: 'app',
        name: 'App',
        component: () => import('@/views/system/app/index.vue'),
        meta: { title: '应用管理', icon: 'Grid', permission: 'system:app:list' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes, ...asyncRoutes],
})

// 全局前置守卫
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // 取消所有未完成的请求
  cancelAllPendingRequests()

  const authStore = useAuthStore()
  const token = authStore.token

  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE || '管理系统'}`
  }

  // 如果已经登录且访问登录页，跳转到首页
  if (to.path === '/login' && token) {
    next('/')
    return
  }

  // 如果未登录且不是登录页，跳转到登录页
  if (!token && to.path !== '/login') {
    next('/login')
    return
  }

  next()
})

export default router
