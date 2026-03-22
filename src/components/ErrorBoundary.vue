<template>
  <div class="error-boundary">
    <slot v-if="!hasError" name="default"></slot>
    <div v-else class="error-content">
      <el-result icon="warning" title="页面出错了" sub-title="请稍后再试或联系管理员">
        <template #extra>
          <el-button type="primary" @click="handleRetry">重新加载</el-button>
          <el-button @click="handleGoBack">返回上页</el-button>
        </template>
      </el-result>
      <div v-if="errorMessage" class="error-details">
        <el-alert :title="errorMessage" type="error" show-icon closable>
          <template #default>
            <p v-if="errorStack" class="error-stack">{{ errorStack }}</p>
          </template>
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'ErrorBoundary'
})

const router = useRouter()
const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')

interface ErrorInfo {
  message: string
  stack?: string
}

onErrorCaptured((err: unknown, instance, info) => {
  const error = err as Error
  hasError.value = true
  errorMessage.value = error.message || '未知错误'
  errorStack.value = error.stack || ''
  
  console.error('Error captured by ErrorBoundary:', error)
  console.error('Error info:', info)
  
  // 返回false表示错误已被处理，不会继续传播
  return false
})

const handleRetry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
  window.location.reload()
}

const handleGoBack = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
  router.go(-1)
}

const reset = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
}

defineExpose({
  reset
})
</script>

<style lang="scss" scoped>
.error-boundary {
  width: 100%;
  height: 100%;
}

.error-content {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.error-details {
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  text-align: left;
}

.error-stack {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 200px;
  overflow-y: auto;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  color: #666;
}
</style>
