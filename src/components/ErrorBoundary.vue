<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-container">
      <el-result
        icon="error"
        title="页面出错了"
        :sub-title="errorMessage"
      >
        <template #extra>
          <el-button type="primary" @click="handleRetry">
            <el-icon><Refresh /></el-icon>
            重试
          </el-button>
          <el-button @click="handleReset">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </el-button>
        </template>
      </el-result>
      <div v-if="showDetails && errorDetails" class="error-details">
        <el-divider />
        <el-alert
          :title="'错误详情'"
          type="error"
          :closable="false"
        >
          <pre>{{ errorDetails }}</pre>
        </el-alert>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = withDefaults(defineProps<{
  /** 是否显示错误详情 */
  showDetails?: boolean
}>(), {
  showDetails: false,
})

const router = useRouter()

const hasError = ref(false)
const errorMessage = ref('发生未知错误')
const errorDetails = ref('')

/**
 * 处理错误
 */
const handleError = (error: unknown): void => {
  hasError.value = true

  if (error instanceof Error) {
    errorMessage.value = error.message || '发生错误'
    errorDetails.value = `${error.name}: ${error.message}\n\n${error.stack || ''}`
  } else if (typeof error === 'string') {
    errorMessage.value = error
    errorDetails.value = error
  } else {
    errorMessage.value = '发生未知错误'
    errorDetails.value = String(error)
  }

  // 可以在这里添加错误上报逻辑
  console.error('ErrorBoundary caught error:', error)
}

/**
 * 重试
 */
const handleRetry = (): void => {
  hasError.value = false
  errorMessage.value = '发生未知错误'
  errorDetails.value = ''
}

/**
 * 返回首页
 */
const handleReset = (): void => {
  hasError.value = false
  errorMessage.value = '发生未知错误'
  errorDetails.value = ''
  router.push('/')
}

// 捕获子组件错误
onErrorCaptured((error) => {
  handleError(error)
  return false // 阻止错误继续传播
})

// 监听全局错误
onMounted(() => {
  const handler = (event: ErrorEvent) => {
    handleError(event.error)
    event.preventDefault()
  }

  const rejectionHandler = (event: PromiseRejectionEvent) => {
    handleError(event.reason)
    event.preventDefault()
  }

  window.addEventListener('error', handler)
  window.addEventListener('unhandledrejection', rejectionHandler)

  // 清理函数
  return () => {
    window.removeEventListener('error', handler)
    window.removeEventListener('unhandledrejection', rejectionHandler)
  }
})
</script>

<style lang="scss" scoped>
.error-boundary {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .error-container {
    max-width: 600px;
    width: 100%;

    .error-details {
      margin-top: 20px;

      pre {
        margin: 0;
        padding: 10px;
        background-color: #f5f5f5;
        border-radius: 4px;
        font-size: 12px;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }
}
</style>
