<template>
  <el-popover
    v-model:visible="visible"
    placement="bottom-start"
    :width="400"
    trigger="click"
  >
    <template #reference>
      <el-input
        :model-value="modelValue"
        placeholder="请选择图标"
        readonly
        style="cursor: pointer"
      >
        <template #prefix>
          <el-icon v-if="modelValue">
            <component :is="modelValue" />
          </el-icon>
        </template>
      </el-input>
    </template>
    <div class="icon-picker">
      <el-input
        v-model="searchText"
        placeholder="搜索图标"
        clearable
        style="margin-bottom: 10px"
      />
      <el-scrollbar height="300px">
        <div class="icon-list">
          <div
            v-for="icon in filteredIcons"
            :key="icon"
            class="icon-item"
            :class="{ active: modelValue === icon }"
            @click="handleSelect(icon)"
          >
            <el-icon :size="24">
              <component :is="icon" />
            </el-icon>
            <span>{{ icon }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import * as Icons from '@element-plus/icons-vue'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const visible = ref(false)
const searchText = ref('')

const iconList = Object.keys(Icons)

const filteredIcons = computed(() => {
  if (!searchText.value) return iconList
  return iconList.filter((icon) =>
    icon.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

const handleSelect = (icon: string) => {
  emit('update:modelValue', icon)
  visible.value = false
}
</script>

<style lang="scss" scoped>
.icon-picker {
  .icon-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;

    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px;
      border: 1px solid #eee;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: #f5f7fa;
      }

      &.active {
        background-color: #ecf5ff;
        border-color: #409eff;
      }

      span {
        font-size: 12px;
        margin-top: 5px;
        word-break: break-all;
        text-align: center;
      }
    }
  }
}
</style>
