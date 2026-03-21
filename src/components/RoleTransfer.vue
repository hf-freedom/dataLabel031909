<template>
  <el-transfer
    v-model="selectedRoles"
    :data="roleList"
    :titles="['可选角色', '已选角色']"
    :props="{
      key: 'id',
      label: 'name',
    }"
    :filterable="filterable"
    :filter-placeholder="filterPlaceholder"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Role } from '@/types'
import { roleApi } from '@/api'

const props = withDefaults(
  defineProps<{
    modelValue?: number[]
    filterable?: boolean
    filterPlaceholder?: string
  }>(),
  {
    modelValue: () => [],
    filterable: true,
    filterPlaceholder: '搜索角色',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void
  (e: 'change', value: number[]): void
}>()

const roleList = ref<Role[]>([])
const selectedRoles = ref<number[]>(props.modelValue)

const fetchRoles = async () => {
  try {
    const res = await roleApi.getAll()
    roleList.value = res.data
  } catch (error) {
    console.error('获取角色列表失败', error)
  }
}

const handleChange = (value: number[]) => {
  emit('update:modelValue', value)
  emit('change', value)
}

watch(
  () => props.modelValue,
  (val) => {
    selectedRoles.value = val
  }
)

onMounted(() => {
  fetchRoles()
})
</script>

<style lang="scss" scoped>
:deep(.el-transfer) {
  display: flex;
  justify-content: center;
}
</style>
