<template>
  <template v-if="!item.meta?.hidden">
    <template v-if="hasOneShowingChild(item.children, item)">
      <el-menu-item
        v-if="onlyOneChild && !onlyOneChild.children"
        :index="resolvePath(onlyOneChild.path)"
      >
        <el-icon v-if="onlyOneChild.meta?.icon || item.meta?.icon">
          <component :is="onlyOneChild.meta?.icon || item.meta?.icon" />
        </el-icon>
        <template #title>
          <span>{{ onlyOneChild.meta?.title || item.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const props = defineProps<{
  item: RouteRecordRaw
  basePath?: string
}>()

const onlyOneChild = ref<RouteRecordRaw | null>(null)

const hasOneShowingChild = (children: RouteRecordRaw[] = [], parent: RouteRecordRaw) => {
  const showingChildren = children.filter((item) => {
    if (item.meta?.hidden) {
      return false
    } else {
      onlyOneChild.value = item
      return true
    }
  })

  if (showingChildren.length === 1) {
    return true
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true } as any
    return true
  }

  return false
}

const resolvePath = (routePath: string) => {
  if (routePath.startsWith('/')) {
    return routePath
  }
  if (props.basePath) {
    const base = props.basePath.endsWith('/') ? props.basePath.slice(0, -1) : props.basePath
    return `${base}/${routePath}`.replace(/\/+/g, '/')
  }
  return routePath
}
</script>
