<template>
  <el-transfer
    v-model="selectedApis"
    :data="apiList"
    :titles="['可选API', '已选API']"
    :props="{
      key: 'id',
      label: 'name',
    }"
    :filterable="filterable"
    :filter-placeholder="filterPlaceholder"
    @change="handleChange"
  >
    <template #default="{ option }">
      <span>{{ option.name }}</span>
      <el-tag size="small" :type="getMethodType(option.method)" style="margin-left: 5px">
        {{ option.method }}
      </el-tag>
    </template>
  </el-transfer>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Api } from '@/types'
import { apiApi } from '@/api'

const props = withDefaults(
  defineProps<{
    modelValue?: number[]
    appId?: number
    filterable?: boolean
    filterPlaceholder?: string
  }>(),
  {
    modelValue: () => [],
    appId: undefined,
    filterable: true,
    filterPlaceholder: '搜索API',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void
  (e: 'change', value: number[]): void
}>()

const apiList = ref<Api[]>([])
const selectedApis = ref<number[]>(props.modelValue)

const fetchApis = async () => {
  try {
    const res = await apiApi.getAll(props.appId)
    apiList.value = res.data
  } catch (error) {
    console.error('获取API列表失败', error)
  }
}

const getMethodType = (method: string) => {
  const types: Record<string, string> = {
    GET: 'success',
    POST: 'primary',
    PUT: 'warning',
    DELETE: 'danger',
    PATCH: 'info',
  }
  return types[method] || 'info'
}

const handleChange = (value: number[]) => {
  emit('update:modelValue', value)
  emit('change', value)
}

watch(
  () => props.modelValue,
  (val) => {
    selectedApis.value = val
  }
)

watch(
  () => props.appId,
  () => {
    fetchApis()
  }
)

onMounted(() => {
  fetchApis()
})
</script>

<style lang="scss" scoped>
:deep(.el-transfer) {
  display: flex;
  justify-content: center;
}
</style>
