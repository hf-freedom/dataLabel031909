<template>
  <el-select
    v-model="currentAppId"
    placeholder="选择应用"
    class="app-selector"
    @change="handleAppChange"
  >
    <el-option
      v-for="app in apps"
      :key="app.id"
      :label="app.name"
      :value="app.id"
    >
      <span>{{ app.name }}</span>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores'
import { appApi } from '@/api'

const appStore = useAppStore()

const apps = computed(() => appStore.apps)
const currentAppId = ref<number | null>(null)

const fetchApps = async () => {
  try {
    const res = await appApi.getAll()
    appStore.setApps(res.data)
    if (res.data.length > 0) {
      const savedAppId = localStorage.getItem('currentAppId')
      const defaultApp = savedAppId
        ? res.data.find(a => a.id === Number(savedAppId)) || res.data[0]
        : res.data[0]
      currentAppId.value = defaultApp.id
      appStore.setCurrentApp(defaultApp)
    }
  } catch (error) {
    console.error('获取应用列表失败', error)
  }
}

const handleAppChange = (appId: number) => {
  const app = apps.value.find(a => a.id === appId)
  if (app) {
    appStore.setCurrentApp(app)
    window.location.reload()
  }
}

onMounted(() => {
  if (apps.value.length === 0) {
    fetchApps()
  } else {
    currentAppId.value = appStore.currentApp?.id || apps.value[0]?.id
  }
})
</script>

<style lang="scss" scoped>
.app-selector {
  width: 150px;
}
</style>
