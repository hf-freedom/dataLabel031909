<template>
  <div class="app-container">
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="应用名称">
          <el-input v-model="queryParams.name" placeholder="请输入应用名称" clearable />
        </el-form-item>
        <el-form-item label="应用标识">
          <el-input v-model="queryParams.code" placeholder="请输入应用标识" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
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
          <span>应用列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增应用
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="name" label="应用名称" width="150" />
        <el-table-column prop="code" label="应用标识" width="150" />
        <el-table-column prop="dbConfig" label="数据库配置" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <status-switch
              :model-value="row.status"
              @change="(val) => handleStatusChange(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="handleBindOrg(row)">绑定机构</el-button>
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
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="应用标识" prop="code">
          <el-input v-model="form.code" placeholder="请输入应用标识" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="数据库配置" prop="dbConfig">
          <el-input
            v-model="form.dbConfig"
            type="textarea"
            :rows="3"
            placeholder="请输入数据库配置（JSON格式，可选）"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <status-switch v-model="form.status" />
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
      v-model="orgDialogVisible"
      title="绑定组织机构"
      width="600px"
    >
      <el-form label-width="100px">
        <el-form-item label="组织机构">
          <org-tree-select
            v-model="selectedOrgIds"
            multiple
            placeholder="请选择组织机构"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="orgDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleBindOrgSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { appApi, type AppQuery, type AppForm } from '@/api/app'
import type { App } from '@/types'
import { StatusSwitch, OrgTreeSelect } from '@/components'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<App[]>([])
const total = ref(0)

const queryParams = reactive<AppQuery>({
  page: 1,
  pageSize: 10,
  name: '',
  code: '',
  status: undefined,
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增应用')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentAppId = ref<number | null>(null)

const form = reactive<AppForm>({
  name: '',
  code: '',
  dbConfig: '',
  status: 1,
  remark: '',
  organizations: [],
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入应用标识', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '应用标识必须以字母开头，只能包含字母、数字、下划线', trigger: 'blur' },
  ],
}

const orgDialogVisible = ref(false)
const selectedOrgIds = ref<number[]>([])

const fetchData = async () => {
  loading.value = true
  try {
    const res = await appApi.getList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取应用列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

const handleReset = () => {
  queryParams.name = ''
  queryParams.code = ''
  queryParams.status = undefined
  queryParams.page = 1
  fetchData()
}

const resetForm = () => {
  form.name = ''
  form.code = ''
  form.dbConfig = ''
  form.status = 1
  form.remark = ''
  form.organizations = []
}

const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogTitle.value = '新增应用'
  dialogVisible.value = true
}

const handleEdit = (row: App) => {
  resetForm()
  isEdit.value = true
  dialogTitle.value = '编辑应用'
  currentAppId.value = row.id
  form.name = row.name
  form.code = row.code
  form.dbConfig = row.dbConfig
  form.status = row.status
  form.remark = row.remark
  form.organizations = row.organizations
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
      await appApi.update({ ...form, id: currentAppId.value })
      ElMessage.success('修改成功')
    } else {
      await appApi.create(form)
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

const handleStatusChange = async (row: App, status: number | boolean) => {
  try {
    await appApi.updateStatus(row.id, status as number)
    ElMessage.success('状态更新成功')
    fetchData()
  } catch (error) {
    console.error('状态更新失败', error)
  }
}

const handleBindOrg = (row: App) => {
  currentAppId.value = row.id
  selectedOrgIds.value = row.organizations
  orgDialogVisible.value = true
}

const handleBindOrgSubmit = async () => {
  if (!currentAppId.value) return
  submitLoading.value = true
  try {
    await appApi.bindOrganizations(currentAppId.value, selectedOrgIds.value)
    ElMessage.success('绑定机构成功')
    orgDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('绑定机构失败', error)
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = async (row: App) => {
  try {
    await ElMessageBox.confirm('确定要删除该应用吗？删除后相关数据将无法恢复', '提示', {
      type: 'warning',
    })
    await appApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    console.error('删除失败', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.app-container {
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
