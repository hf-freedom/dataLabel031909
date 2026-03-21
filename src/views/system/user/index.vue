<template>
  <div class="user-container">
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="用户名">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="queryParams.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="组织机构">
          <org-tree-select v-model="queryParams.orgId" placeholder="请选择组织机构" />
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
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column label="组织机构" min-width="200">
          <template #default="{ row }">
            <el-tag
              v-for="org in row.organizations"
              :key="org.id"
              :type="org.id === row.primaryOrgId ? 'primary' : 'info'"
              style="margin-right: 5px"
            >
              {{ org.name }}
              <span v-if="org.id === row.primaryOrgId">(主)</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="150">
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles"
              :key="role.id"
              style="margin-right: 5px"
            >
              {{ role.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <status-switch
              :model-value="row.status"
              @change="(val) => handleStatusChange(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="handleBindRole(row)">绑定角色</el-button>
            <el-button type="primary" link @click="handleBindOrg(row)">绑定机构</el-button>
            <el-button type="warning" link @click="handleResetPwd(row)">重置密码</el-button>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <status-switch v-model="form.status" />
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
      v-model="roleDialogVisible"
      title="绑定角色"
      width="700px"
    >
      <role-transfer v-model="selectedRoleIds" />
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleBindRoleSubmit">
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
        <el-form-item label="主机构">
          <el-select v-model="primaryOrgId" placeholder="请选择主机构">
            <el-option
              v-for="org in availableOrgs"
              :key="org.id"
              :label="org.name"
              :value="org.id"
            />
          </el-select>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { userApi, type UserQuery, type UserForm } from '@/api/user'
import type { User } from '@/types'
import { OrgTreeSelect, RoleTransfer, StatusSwitch } from '@/components'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<User[]>([])
const total = ref(0)

const queryParams = reactive<UserQuery>({
  page: 1,
  pageSize: 10,
  username: '',
  name: '',
  phone: '',
  status: undefined,
  orgId: undefined,
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentUserId = ref<number | null>(null)

const form = reactive<UserForm>({
  username: '',
  name: '',
  phone: '',
  email: '',
  status: 1,
  orgIds: [],
  primaryOrgId: null,
  roleIds: [],
  password: '',
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' },
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' },
  ],
}

const roleDialogVisible = ref(false)
const selectedRoleIds = ref<number[]>([])

const orgDialogVisible = ref(false)
const selectedOrgIds = ref<number[]>([])
const primaryOrgId = ref<number | null>(null)

const availableOrgs = computed(() => {
  return []
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await userApi.getList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取用户列表失败', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

const handleReset = () => {
  queryParams.username = ''
  queryParams.name = ''
  queryParams.phone = ''
  queryParams.status = undefined
  queryParams.orgId = undefined
  queryParams.page = 1
  fetchData()
}

const resetForm = () => {
  form.username = ''
  form.name = ''
  form.phone = ''
  form.email = ''
  form.status = 1
  form.orgIds = []
  form.primaryOrgId = null
  form.roleIds = []
  form.password = ''
}

const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogTitle.value = '新增用户'
  dialogVisible.value = true
}

const handleEdit = (row: User) => {
  resetForm()
  isEdit.value = true
  dialogTitle.value = '编辑用户'
  currentUserId.value = row.id
  form.username = row.username
  form.name = row.name
  form.phone = row.phone
  form.email = row.email
  form.status = row.status
  form.orgIds = row.organizations.map(o => o.id)
  form.primaryOrgId = row.primaryOrgId
  form.roleIds = row.roles.map(r => r.id)
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
      await userApi.update({ ...form, id: currentUserId.value })
      ElMessage.success('修改成功')
    } else {
      await userApi.create(form)
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

const handleStatusChange = async (row: User, status: number | boolean) => {
  try {
    await userApi.updateStatus(row.id, status as number)
    ElMessage.success('状态更新成功')
    fetchData()
  } catch (error) {
    console.error('状态更新失败', error)
  }
}

const handleBindRole = (row: User) => {
  currentUserId.value = row.id
  selectedRoleIds.value = row.roles.map(r => r.id)
  roleDialogVisible.value = true
}

const handleBindRoleSubmit = async () => {
  if (!currentUserId.value) return
  submitLoading.value = true
  try {
    await userApi.bindRoles(currentUserId.value, selectedRoleIds.value)
    ElMessage.success('绑定角色成功')
    roleDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('绑定角色失败', error)
  } finally {
    submitLoading.value = false
  }
}

const handleBindOrg = (row: User) => {
  currentUserId.value = row.id
  selectedOrgIds.value = row.organizations.map(o => o.id)
  primaryOrgId.value = row.primaryOrgId
  orgDialogVisible.value = true
}

const handleBindOrgSubmit = async () => {
  if (!currentUserId.value) return
  submitLoading.value = true
  try {
    await userApi.bindOrgs(currentUserId.value, selectedOrgIds.value, primaryOrgId.value)
    ElMessage.success('绑定机构成功')
    orgDialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('绑定机构失败', error)
  } finally {
    submitLoading.value = false
  }
}

const handleResetPwd = async (row: User) => {
  try {
    await ElMessageBox.confirm('确定要重置该用户的密码吗？', '提示', {
      type: 'warning',
    })
    await userApi.resetPassword(row.id)
    ElMessage.success('密码重置成功，默认密码为：123456')
  } catch (error) {
    console.error('重置密码失败', error)
  }
}

const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      type: 'warning',
    })
    await userApi.delete(row.id)
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
.user-container {
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
