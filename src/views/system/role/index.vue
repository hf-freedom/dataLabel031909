<template>
  <div class="role-container">
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="角色名称">
          <el-input v-model="queryParams.name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="queryParams.code" placeholder="请输入角色编码" clearable />
        </el-form-item>
        <el-form-item label="角色类型">
          <el-select v-model="queryParams.type" placeholder="请选择角色类型" clearable>
            <el-option label="内置" :value="1" />
            <el-option label="自定义" :value="2" />
          </el-select>
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
          <span>角色列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增角色
          </el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border stripe>
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="code" label="角色编码" width="150" />
        <el-table-column prop="type" label="角色类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'danger' : 'success'">
              {{ row.type === 1 ? '内置' : '自定义' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <status-switch
              :model-value="row.status"
              :disabled="row.type === 1"
              @change="(val) => handleStatusChange(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="350" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="primary" link @click="handleAuthMenu(row)">菜单权限</el-button>
            <el-button type="primary" link @click="handleAuthApi(row)">API权限</el-button>
            <el-button type="primary" link @click="handleAuthData(row)">数据权限</el-button>
            <el-button type="warning" link @click="handleCopy(row)">复制</el-button>
            <el-button type="info" link @click="handleViewUsers(row)">用户</el-button>
            <el-button
              type="danger"
              link
              :disabled="row.type === 1"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色编码" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="角色类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择角色类型" :disabled="isEdit">
            <el-option label="内置" :value="1" />
            <el-option label="自定义" :value="2" />
          </el-select>
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
      v-model="menuDialogVisible"
      title="菜单权限配置"
      width="500px"
    >
      <menu-tree
        ref="menuTreeRef"
        v-model="selectedMenuIds"
        :app-id="currentAppId"
      />
      <template #footer>
        <el-button @click="menuDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleMenuSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="apiDialogVisible"
      title="API权限配置"
      width="800px"
    >
      <api-transfer
        v-model="selectedApiIds"
        :app-id="currentAppId"
      />
      <template #footer>
        <el-button @click="apiDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleApiSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="dataDialogVisible"
      title="数据权限配置"
      width="600px"
    >
      <el-form label-width="100px">
        <el-form-item label="数据范围">
          <el-select v-model="dataScope" placeholder="请选择数据范围">
            <el-option label="仅本人" :value="1" />
            <el-option label="本部门" :value="2" />
            <el-option label="本部门及子部门" :value="3" />
            <el-option label="自定义" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dataScope === 4" label="组织机构">
          <org-tree-select
            v-model="selectedDataOrgIds"
            multiple
            placeholder="请选择组织机构"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dataDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleDataSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="usersDialogVisible"
      title="关联用户"
      width="800px"
    >
      <el-table :data="roleUsers" v-loading="usersLoading" border stripe>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
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
import { roleApi, type RoleQuery, type RoleForm } from '@/api/role'
import type { Role, User } from '@/types'
import { StatusSwitch, MenuTree, ApiTransfer, OrgTreeSelect } from '@/components'
import { useAppStore } from '@/stores'

const appStore = useAppStore()
const currentAppId = appStore.currentApp?.id

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<Role[]>([])
const total = ref(0)

const queryParams = reactive<RoleQuery>({
  page: 1,
  pageSize: 10,
  name: '',
  code: '',
  type: undefined,
  status: undefined,
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentRoleId = ref<number | null>(null)

const form = reactive<RoleForm>({
  name: '',
  code: '',
  type: 2,
  status: 1,
  remark: '',
  menus: [],
  apis: [],
  dataScope: 1,
  dataOrgs: [],
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '角色编码必须以字母开头，只能包含字母、数字、下划线', trigger: 'blur' },
  ],
  type: [{ required: true, message: '请选择角色类型', trigger: 'change' }],
}

const menuDialogVisible = ref(false)
const menuTreeRef = ref()
const selectedMenuIds = ref<number[]>([])

const apiDialogVisible = ref(false)
const selectedApiIds = ref<number[]>([])

const dataDialogVisible = ref(false)
const dataScope = ref(1)
const selectedDataOrgIds = ref<number[]>([])

const usersDialogVisible = ref(false)
const roleUsers = ref<User[]>([])
const usersLoading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await roleApi.getList(queryParams)
    tableData.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取角色列表失败', error)
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
  queryParams.type = undefined
  queryParams.status = undefined
  queryParams.page = 1
  fetchData()
}

const resetForm = () => {
  form.name = ''
  form.code = ''
  form.type = 2
  form.status = 1
  form.remark = ''
  form.menus = []
  form.apis = []
  form.dataScope = 1
  form.dataOrgs = []
}

const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogTitle.value = '新增角色'
  dialogVisible.value = true
}

const handleEdit = (row: Role) => {
  resetForm()
  isEdit.value = true
  dialogTitle.value = '编辑角色'
  currentRoleId.value = row.id
  form.name = row.name
  form.code = row.code
  form.type = row.type
  form.status = row.status
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
      await roleApi.update({ ...form, id: currentRoleId.value })
      ElMessage.success('修改成功')
    } else {
      await roleApi.create(form)
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

const handleStatusChange = async (row: Role, status: number | boolean) => {
  try {
    await roleApi.updateStatus(row.id, status as number)
    ElMessage.success('状态更新成功')
    fetchData()
  } catch (error) {
    console.error('状态更新失败', error)
  }
}

const handleAuthMenu = async (row: Role) => {
  currentRoleId.value = row.id
  try {
    const res = await roleApi.getMenus(row.id)
    selectedMenuIds.value = res.data
  } catch (error) {
    selectedMenuIds.value = []
  }
  menuDialogVisible.value = true
}

const handleMenuSubmit = async () => {
  if (!currentRoleId.value) return
  submitLoading.value = true
  try {
    await roleApi.updateMenus(currentRoleId.value, selectedMenuIds.value)
    ElMessage.success('菜单权限配置成功')
    menuDialogVisible.value = false
  } catch (error) {
    console.error('菜单权限配置失败', error)
  } finally {
    submitLoading.value = false
  }
}

const handleAuthApi = async (row: Role) => {
  currentRoleId.value = row.id
  try {
    const res = await roleApi.getApis(row.id)
    selectedApiIds.value = res.data
  } catch (error) {
    selectedApiIds.value = []
  }
  apiDialogVisible.value = true
}

const handleApiSubmit = async () => {
  if (!currentRoleId.value) return
  submitLoading.value = true
  try {
    await roleApi.updateApis(currentRoleId.value, selectedApiIds.value)
    ElMessage.success('API权限配置成功')
    apiDialogVisible.value = false
  } catch (error) {
    console.error('API权限配置失败', error)
  } finally {
    submitLoading.value = false
  }
}

const handleAuthData = (row: Role) => {
  currentRoleId.value = row.id
  dataScope.value = row.dataScope
  selectedDataOrgIds.value = row.dataOrgs
  dataDialogVisible.value = true
}

const handleDataSubmit = async () => {
  if (!currentRoleId.value) return
  submitLoading.value = true
  try {
    await roleApi.updateDataScope(currentRoleId.value, dataScope.value, selectedDataOrgIds.value)
    ElMessage.success('数据权限配置成功')
    dataDialogVisible.value = false
  } catch (error) {
    console.error('数据权限配置失败', error)
  } finally {
    submitLoading.value = false
  }
}

const handleCopy = async (row: Role) => {
  try {
    await ElMessageBox.confirm('确定要复制该角色吗？', '提示', {
      type: 'warning',
    })
    await roleApi.copy(row.id)
    ElMessage.success('复制成功')
    fetchData()
  } catch (error) {
    console.error('复制失败', error)
  }
}

const handleViewUsers = async (row: Role) => {
  usersLoading.value = true
  usersDialogVisible.value = true
  try {
    const res = await roleApi.getUsers(row.id)
    roleUsers.value = res.data
  } catch (error) {
    console.error('获取关联用户失败', error)
  } finally {
    usersLoading.value = false
  }
}

const handleDelete = async (row: Role) => {
  try {
    await ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
      type: 'warning',
    })
    await roleApi.delete(row.id)
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
.role-container {
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
