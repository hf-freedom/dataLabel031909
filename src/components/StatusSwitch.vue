<template>
  <el-switch
    :model-value="modelValue"
    :active-value="activeValue"
    :inactive-value="inactiveValue"
    :active-text="activeText"
    :inactive-text="inactiveText"
    :disabled="disabled"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: number | boolean
    activeValue?: number | boolean
    inactiveValue?: number | boolean
    activeText?: string
    inactiveText?: string
    disabled?: boolean
  }>(),
  {
    modelValue: 1,
    activeValue: 1,
    inactiveValue: 0,
    activeText: '启用',
    inactiveText: '停用',
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | boolean): void
  (e: 'change', value: number | boolean): void
}>()

const handleChange = (value: number | boolean) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>
