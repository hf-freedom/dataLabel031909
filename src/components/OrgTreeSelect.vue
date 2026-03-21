<template>
  <el-tree-select
    v-model="selectedValue"
    :data="treeData"
    :props="defaultProps"
    :placeholder="placeholder"
    :clearable="clearable"
    :multiple="multiple"
    :check-strictly="checkStrictly"
    :disabled="disabled"
    :filterable="filterable"
    node-key="id"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Organization } from '@/types'
import { organizationApi } from '@/api'

const props = withDefaults(
  defineProps<{
    modelValue?: number | number[] | null
    placeholder?: string
    clearable?: boolean
    multiple?: boolean
    checkStrictly?: boolean
    disabled?: boolean
    filterable?: boolean
  }>(),
  {
    modelValue: null,
    placeholder: '请选择组织机构',
    clearable: true,
    multiple: false,
    checkStrictly: true,
    disabled: false,
    filterable: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | number[] | null): void
  (e: 'change', value: number | number[] | null): void
}>()

const defaultProps = {
  label: 'name',
  value: 'id',
  children: 'children',
}

const treeData = ref<Organization[]>([])
const selectedValue = ref<number | number[] | null>(props.modelValue)

const fetchTree = async () => {
  try {
    const res = await organizationApi.getTree()
    treeData.value = res.data
  } catch (error) {
    console.error('获取组织机构树失败', error)
  }
}

const handleChange = (value: number | number[] | null) => {
  emit('update:modelValue', value)
  emit('change', value)
}

watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val
  }
)

onMounted(() => {
  fetchTree()
})
</script>
