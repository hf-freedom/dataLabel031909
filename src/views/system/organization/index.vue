<template>
  <div class="organization-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>组织机构树</span>
              <el-button type="primary" size="small" @click="handleAdd(null)">
                <el-icon><Plus /></el-icon>
                新增
              </el-button>
            </div>
          </template>
          <el-input
            v-model="filterText"
            placeholder="输入关键字筛选"
            clearable
            style="margin-bottom: 15px"
          />
          <el-tree
            ref="treeRef"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            :default-expand-all="true"
            highlight-current
            node-key="id"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="tree-node">
                <span>{{ node.label }}</span>
                <span class="tree-actions">
                  <el-button type="primary" link size="small" @click.stop="handleAdd(data)">
                    新增
                  </el-button>
                  <el-button type="primary" link size="small" @click.stop="handleEdit(data)">
                    编辑
                  </el-button>
                  <el-button type="danger" link size="small" @click.stop="handleDelete(data)">
                    删除
                  </el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card v-if="currentNode">
          <template #header>
            <div class="card-header">
              <span>{{ currentNode.name }} - 详情</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="机构名称">{{ currentNode.name }}</el-descriptions-item>
            <el-descriptions-item label="机构编码">{{ currentNode.code }}</el-descriptions-item>
            <el-descriptions-item label="排序码">{{ currentNode.sort }}</el-descriptions-item>
            <el-descriptions-item label="机构类型">
              <el-tag :type="getTypeTag(currentNode.type)">
                {{ getTypeName(currentNode.type) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="负责人">{{ currentNode.leader }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ currentNode.phone }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <status-switch
                :model-value="currentNode.status"
                @change="(val) => handleStatusChange(currentNode!, val)"
              />
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ currentNode.createdAt }}</el-descriptions-item>
          </el-descriptions>

          <el-divider />

          <div class="section-header">
            <span>机构下用户</span>
            <el-button type="primary" size="small" @click="fetchOrgUsers">
              刷新
            </el-button>
          </div>
          <el-table :data="orgUsers" v-loading="usersLoading" border stripe>
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
        </el-card>
        <el-card v-else>
          <el-empty description="请选择左侧组织机构节点" />
        </el-card>
      </el-col>
    </el-row>

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
        <el-form-item label="上级机构" prop="parentId">
          <org-tree-select
            v-model="form.parentId"
            placeholder="请选择上级机构"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="机构编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入机构编码" />
        </el-form-item>
        <el-form-item label="排序码" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="9999" />
        </el-form-item>
        <el-form-item label="机构类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择机构类型">
            <el-option label="公司" :value="1" />
            <el-option label="部门" :value="2" />
            <el-option label="小组" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { organizationApi, type OrganizationForm } from '@/api/organization'
import type { Organization, User } from '@/types'
import { OrgTreeSelect, StatusSwitch } from '@/components'

const treeRef = ref()
const filterText = ref('')
const treeData = ref<Organization[]>([])
const currentNode = ref<Organization | null>(null)
const orgUsers = ref<User[]>([])
const usersLoading = ref(false)

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新增机构')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentOrgId = ref<number | null>(null)

const defaultProps = {
  label: 'name',
  children: 'children',
}

const form = reactive<OrganizationForm>({
  name: '',
  code: '',
  sort: 0,
  type: 1,
  leader: '',
  phone: '',
  status: 1,
  parentId: null,
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入机构编码', trigger: 'blur' }],
  type: [{ required: true, message: '请选择机构类型', trigger: 'change' }],
}

const filterNode = (value: string, data: Organization) => {
  if (!value) return true
  return data.name.includes(value)
}

watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

const fetchTree = async () => {
  loading.value = true
  try {
    const res = await organizationApi.getTree()
    treeData.value = res.data
  } catch (error) {
    console.error('获取组织机构树失败', error)
  } finally {
    loading.value = false
  }
}

const fetchOrgUsers = async () => {
  if (!currentNode.value) return
  usersLoading.value = true
  try {
    const res = await organizationApi.getUsers(currentNode.value.id)
    orgUsers.value = res.data
  } catch (error) {
    console.error('获取机构用户失败', error)
  } finally {
    usersLoading.value = false
  }
}

const handleNodeClick = (data: Organization) => {
  currentNode.value = data
  fetchOrgUsers()
}

const getTypeName = (type: number) => {
  const types: Record<number, string> = {
    1: '公司',
    2: '部门',
    3: '小组',
  }
  return types[type] || '未知'
}

const getTypeTag = (type: number) => {
  const types: Record<number, string> = {
    1: 'primary',
    2: 'success',
    3: 'warning',
  }
  return types[type] || 'info'
}

const resetForm = () => {
  form.name = ''
  form.code = ''
  form.sort = 0
  form.type = 1
  form.leader = ''
  form.phone = ''
  form.status = 1
  form.parentId = null
}

const handleAdd = (parent: Organization | null) => {
  resetForm()
  isEdit.value = false
  dialogTitle.value = '新增机构'
  if (parent) {
    form.parentId = parent.id
  }
  dialogVisible.value = true
}

const handleEdit = (row: Organization) => {
  resetForm()
  isEdit.value = true
  dialogTitle.value = '编辑机构'
  currentOrgId.value = row.id
  form.name = row.name
  form.code = row.code
  form.sort = row.sort
  form.type = row.type
  form.leader = row.leader
  form.phone = row.phone
  form.status = row.status
  form.parentId = row.parentId
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
      await organizationApi.update({ ...form, id: currentOrgId.value })
      ElMessage.success('修改成功')
    } else {
      await organizationApi.create(form)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchTree()
  } catch (error) {
    console.error('提交失败', error)
  } finally {
    submitLoading.value = false
  }
}

const handleStatusChange = async (row: Organization, status: number | boolean) => {
  try {
    await organizationApi.update(row.id)
    ElMessage.success('状态更新成功')
    fetchTree()
  } catch (error) {
    console.error('状态更新失败', error)
  }
}

const handleDelete = async (row: Organization) => {
  if (row.children && row.children.length > 0) {
    ElMessage.warning('请先删除子节点')
    return
  }
  try {
    await ElMessageBox.confirm('确定要删除该机构吗？', '提示', {
      type: 'warning',
    })
    await organizationApi.delete(row.id)
    ElMessage.success('删除成功')
    currentNode.value = null
    fetchTree()
  } catch (error) {
    console.error('删除失败', error)
  }
}

onMounted(() => {
  fetchTree()
})
</script>

<style lang="scss" scoped>
.organization-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;

    .tree-actions {
      display: none;
    }

    &:hover .tree-actions {
      display: inline-block;
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-weight: bold;
  }
}
</style>
