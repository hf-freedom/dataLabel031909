export * from './auth'
export * from './menu'
export * from './appState'
export * from './organization'
export * from './role'

// 兼容旧代码的导出，标记为已弃用
/**
 * @deprecated 请使用 useAuthStore, useMenuStore, useAppStateStore 替代
 */
export * from './user'
