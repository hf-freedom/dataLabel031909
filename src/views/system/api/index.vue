<template>
  <div class="api-container">
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="接口名称">
          <el-input v-model="queryParams.name" placeholder="请输入接口名称" clearable />
        </el-form-item>
        <el-form-item label="请求方式">
          <el-select v-model="queryParams.method" placeholder="请选择请求方式" clearable>
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
            <el-option label="PATCH" value="PATCH" />
          </el-select>
        </el-form-item>
        <el-form-item label="接口路径">
          <el-input v-model="queryParams.path" placeholder="请输入接口路径" clearable />
        </el-form-item>
        <el-form-item label="所属应用">
          <el-select v-model="queryParams.appId" placeholder="请选择所属应用" clearable>
            <el-option
              v-for="app in apps"
              :key="app.id"
              :label="app.name"
              :value="app.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>API权限列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="name" label="接口名称" min-width="150" />
        <el-table-column prop="method" label="请求方式" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getMethodType(row.method)" size="small">
              {{ row.method }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="接口路径" min-width="250" show-overflow-tooltip />
        <el-table-column prop="appId" label="所属应用" width="120">
          <template #default="{ row }">
            {{ getAppName(row.appId) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="info" link @click="handleViewRoles(row)">授权角色</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="接口名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入接口名称" />
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-select v-model="form.method" placeholder="请选择请求方式">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
            <el-option label="PATCH" value="PATCH" />
          </el-select>
        </el-form-item>
        <el-form-item label="接口路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入接口路径，如：/api/user/list" />
        </el-form-item>
        <el-form-item label="所属应用" prop="appId">
          <el-select v-model="form.appId" placeholder="请选择所属应用">
            <el-option
              v-for="app in apps"
              :key="app.id"
              :label="app.name"
              :value="app.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="rolesDialogVisible"
      title="授权角色"
      width="600px"
    >
      <el-table :data="apiRoles" v-loading="rolesLoading" border stripe>
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="type" label="角色类型">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'danger' : 'success'" size="small">
              {{ row.type === 1 ? '内置' : '自定义' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { apiApi, type ApiQuery, type ApiForm } from '@/api/api'
import type { Api, App, Role } from '@/types'
import { appApi } from '@/api'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<Api[]>([])
const total = ref(0)
const apps = ref<App[]>([])

const queryParams = reactive<ApiQuery>({
  page: 1,
  pageSize: 10,
  name: '',
  method: '',
  path: '',
  appId: undefined,
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增API')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentApiId = ref<number | null>(null)

const form = reactive<ApiForm>({
  name: '',
  method: 'GET',
  path: '',
  appId: 0,
  remark: '',
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }],
  method: [{ required: true, message: '请选择请求方式', trigger: 'change' }],
  path: [
    { required: true, message: '请输入接口路径', trigger: 'blur' },
    { pattern: /^\//, message: '接口路径必须以/开头', trigger: 'blur' },
  ],
  appId: [{ required: true, message: '请选择所属应用', trigger: 'change' }],
}

const rolesDialogVisible = ref(false)
const apiRoles = ref<Role[]>([])
const rolesLoading = ref(false)

const fetchApps = async () => {
  try {
    const res = await appApi.getAll()
    apps.value = res.data
  } catch (error) {
    console.error('获取应用列表失败', error)
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await apiApi.getList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取API列表失败', error)
  } finally {
    loading.value = false
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

const getAppName = (appId: number) => {
  const app = apps.value.find(a => a.id === appId)
  return app?.name || '-'
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

const handleReset = () => {
  queryParams.name = ''
  queryParams.method = ''
  queryParams.path = ''
  queryParams.appId = undefined
  queryParams.page = 1
  fetchData()
}

const resetForm = () => {
  form.name = ''
  form.method = 'GET'
  form.path = ''
  form.appId = apps.value[0]?.id || 0
  form.remark = ''
}

const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogTitle.value = '新增API'
  dialogVisible.value = true
}

const handleEdit = (row: Api) => {
  resetForm()
  isEdit.value = true
  dialogTitle.value = '编辑API'
  currentApiId.value = row.id
  form.name = row.name
  form.method = row.method
  form.path = row.path
  form.appId = row.appId
  form.remark = row.remark
  dialogVisible.value = true
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (isEdit.value) {
      await apiApi.update({ ...form, id: currentApiId.value })
      ElMessage.success('修改成功')
    } else {
      await apiApi.create(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('提交失败', error)
  } finally {
    submitLoading.value = false
  }
}

const handleViewRoles = async (row: Api) => {
  rolesLoading.value = true
  rolesDialogVisible.value = true
  try {
    const res = await apiApi.getRoles(row.id)
    apiRoles.value = res.data
  } catch (error) {
    console.error('获取授权角色失败', error)
  } finally {
    rolesLoading.value = false
  }
}

const handleDelete = async (row: Api) => {
  try {
    await ElMessageBox.confirm('确定要删除该API吗？', '提示', {
      type: 'warning',
    })
    await apiApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    console.error('删除失败', error)
  }
}

onMounted(() => {
  fetchApps()
  fetchData()
})
</script>

<style lang="scss" scoped>
.api-container {
  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .el-pagination {
      margin-top: 20px;
      justify-content: flex-end;
    }
  }
}
</style>
