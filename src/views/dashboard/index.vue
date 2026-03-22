<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #409EFF">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.userCount }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #67C23A">
              <el-icon><OfficeBuilding /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.orgCount }}</div>
              <div class="stat-label">组织机构</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #E6A23C">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.roleCount }}</div>
              <div class="stat-label">角色数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #F56C6C">
              <el-icon><Grid /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.appCount }}</div>
              <div class="stat-label">应用数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>快捷操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/system/user')">
              <el-icon><User /></el-icon>
              用户管理
            </el-button>
            <el-button type="success" @click="$router.push('/system/organization')">
              <el-icon><OfficeBuilding /></el-icon>
              组织机构
            </el-button>
            <el-button type="warning" @click="$router.push('/system/role')">
              <el-icon><UserFilled /></el-icon>
              角色管理
            </el-button>
            <el-button type="info" @click="$router.push('/system/menu')">
              <el-icon><Menu /></el-icon>
              菜单管理
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>系统信息</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="系统名称">{{ title }}</el-descriptions-item>
            <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="技术栈">Vue 3 + TypeScript + Element Plus</el-descriptions-item>
            <el-descriptions-item label="当前用户">{{ authStore.userInfo?.name }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores'

const title = import.meta.env.VITE_APP_TITLE
const authStore = useAuthStore()

const stats = ref({
  userCount: 128,
  orgCount: 15,
  roleCount: 8,
  appCount: 3,
})

onMounted(() => {
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;

        .el-icon {
          font-size: 28px;
          color: #fff;
        }
      }

      .stat-info {
        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 14px;
          color: #999;
          margin-top: 5px;
        }
      }
    }
  }

  .quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>
