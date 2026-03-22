<template>
  <slot v-if="!hasError" />
  <div v-else class="error-boundary">
    <div class="error-content">
      <el-icon class="error-icon"><WarningFilled /></el-icon>
      <h2 class="error-title">页面出错了</h2>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-actions">
        <el-button type="primary" @click="handleRetry">
          重试
        </el-button>
        <el-button @click="handleGoHome">
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, type ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((error: Error, instance: ComponentPublicInstance | null, info: string) => {
  hasError.value = true
  errorMessage.value = error.message || '未知错误'
  console.error('Error captured by ErrorBoundary:', error)
  console.error('Component:', instance)
  console.error('Error info:', info)
  return false
})

const handleRetry = () => {
  hasError.value = false
  errorMessage.value = ''
}

const handleGoHome = () => {
  hasError.value = false
  errorMessage.value = ''
  router.push('/')
}
</script>

<style lang="scss" scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;

  .error-content {
    text-align: center;

    .error-icon {
      font-size: 64px;
      color: #f56c6c;
      margin-bottom: 20px;
    }

    .error-title {
      font-size: 24px;
      color: #303133;
      margin-bottom: 12px;
    }

    .error-message {
      font-size: 14px;
      color: #909399;
      margin-bottom: 24px;
    }

    .error-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
    }
  }
}
</style>
