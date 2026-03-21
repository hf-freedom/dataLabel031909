<template>
  <el-tree
    ref="treeRef"
    :data="treeData"
    :props="defaultProps"
    :show-checkbox="showCheckbox"
    :default-checked-keys="checkedKeys"
    :default-expand-all="defaultExpandAll"
    :check-strictly="checkStrictly"
    node-key="id"
    @check="handleCheck"
  >
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <el-icon v-if="data.icon">
          <component :is="data.icon" />
        </el-icon>
        <span>{{ node.label }}</span>
        <el-tag v-if="showType" size="small" :type="getTypeTag(data.type)" style="margin-left: 5px">
          {{ getTypeName(data.type) }}
        </el-tag>
      </span>
    </template>
  </el-tree>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Menu } from '@/types'
import { menuApi } from '@/api'

const props = withDefaults(
  defineProps<{
    modelValue?: number[]
    appId?: number
    showCheckbox?: boolean
    checkStrictly?: boolean
    defaultExpandAll?: boolean
    showType?: boolean
  }>(),
  {
    modelValue: () => [],
    appId: undefined,
    showCheckbox: true,
    checkStrictly: false,
    defaultExpandAll: true,
    showType: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void
  (e: 'change', value: number[]): void
}>()

const treeRef = ref()
const defaultProps = {
  label: 'name',
  children: 'children',
}

const treeData = ref<Menu[]>([])
const checkedKeys = ref<number[]>(props.modelValue)

const fetchTree = async () => {
  try {
    const res = await menuApi.getTree(props.appId)
    treeData.value = res.data
  } catch (error) {
    console.error('获取菜单树失败', error)
  }
}

const getTypeName = (type: number) => {
  const types: Record<number, string> = {
    1: '目录',
    2: '菜单',
    3: '按钮',
  }
  return types[type] || '未知'
}

const getTypeTag = (type: number) => {
  const types: Record<number, string> = {
    1: 'primary',
    2: 'success',
    3: 'warning',
  }
  return types[type] || 'info'
}

const handleCheck = () => {
  const checkedNodes = treeRef.value?.getCheckedNodes(false, true) || []
  const checkedIds = checkedNodes.map((node: Menu) => node.id)
  emit('update:modelValue', checkedIds)
  emit('change', checkedIds)
}

watch(
  () => props.modelValue,
  (val) => {
    checkedKeys.value = val
  }
)

watch(
  () => props.appId,
  () => {
    fetchTree()
  }
)

onMounted(() => {
  fetchTree()
})

defineExpose({
  getCheckedKeys: () => treeRef.value?.getCheckedKeys(),
  setCheckedKeys: (keys: number[]) => treeRef.value?.setCheckedKeys(keys),
})
</script>

<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
