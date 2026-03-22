<template>
  <div class="menu-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>菜单管理</span>
            <el-select
              v-model="currentAppId"
              placeholder="选择应用"
              style="width: 200px; margin-left: 20px"
              @change="fetchTree"
            >
              <el-option
                v-for="app in apps"
                :key="app.id"
                :label="app.name"
                :value="app.id"
              />
            </el-select>
          </div>
          <el-button type="primary" @click="handleAdd(null)">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
        </div>
      </template>

      <el-table
        :data="tableData"
        v-loading="loading"
        row-key="id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        default-expand-all
      >
        <el-table-column prop="name" label="菜单名称" min-width="180">
          <template #default="{ row }">
            <el-icon v-if="row.icon">
              <component :is="row.icon" />
            </el-icon>
            <span style="margin-left: 5px">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="菜单类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">
              {{ getTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由路径" min-width="150" show-overflow-tooltip />
        <el-table-column prop="component" label="组件路径" min-width="180" show-overflow-tooltip />
        <el-table-column prop="permission" label="权限标识" min-width="150" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column prop="hidden" label="是否隐藏" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.hidden === MenuHidden.Hidden ? 'danger' : 'success'" size="small">
              {{ row.hidden === MenuHidden.Hidden ? '隐藏' : '显示' }}
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
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleAdd(row)">新增</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="menuTreeData"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择上级菜单"
            check-strictly
            clearable
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="MenuType.Directory">目录</el-radio>
            <el-radio :label="MenuType.Menu">菜单</el-radio>
            <el-radio :label="MenuType.Button">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item v-if="form.type !== MenuType.Button" label="菜单图标" prop="icon">
          <icon-picker v-model="form.icon" />
        </el-form-item>
        <el-form-item v-if="form.type !== MenuType.Button" label="路由路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item v-if="form.type === MenuType.Menu" label="组件路径" prop="component">
          <el-input v-model="form.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="form.permission" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="排序码" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="9999" />
        </el-form-item>
        <el-form-item v-if="form.type !== MenuType.Button" label="是否隐藏" prop="hidden">
          <el-radio-group v-model="form.hidden">
            <el-radio :label="MenuHidden.Visible">显示</el-radio>
            <el-radio :label="MenuHidden.Hidden">隐藏</el-radio>
          </el-radio-group>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { menuApi } from '@/api/menu'
import type { Menu, MenuForm, App } from '@/types'
import { MenuType, MenuHidden, MenuStatus } from '@/types'
import { appApi } from '@/api'
import { StatusSwitch, IconPicker } from '@/components'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<Menu[]>([])
const menuTreeData = ref<Menu[]>([])
const apps = ref<App[]>([])
const currentAppId = ref<number | null>(null)

const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const currentMenuId = ref<number | null>(null)

const form = reactive<MenuForm>({
  name: '',
  type: MenuType.Directory,
  parentId: null,
  path: '',
  component: '',
  permission: '',
  icon: '',
  sort: 0,
  hidden: MenuHidden.Visible,
  status: MenuStatus.Enabled,
  appId: 0,
})

const rules = computed<FormRules>(() => ({
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: form.type !== MenuType.Button ? [{ required: true, message: '请输入路由路径', trigger: 'blur' }] : [],
  component: form.type === MenuType.Menu ? [{ required: true, message: '请输入组件路径', trigger: 'blur' }] : [],
}))

const fetchApps = async () => {
  try {
    const res = await appApi.getAll()
    apps.value = res.data
    if (res.data.length > 0) {
      currentAppId.value = res.data[0].id
      fetchTree()
    }
  } catch (error) {
    console.error('获取应用列表失败', error)
  }
}

const fetchTree = async () => {
  if (!currentAppId.value) return
  loading.value = true
  try {
    const res = await menuApi.getTree(currentAppId.value)
    tableData.value = res.data
    menuTreeData.value = [{ id: 0, name: '根目录', children: res.data } as unknown as Menu]
  } catch (error) {
    console.error('获取菜单树失败', error)
  } finally {
    loading.value = false
  }
}

const getTypeName = (type: MenuType): string => {
  const types: Record<MenuType, string> = {
    [MenuType.Directory]: '目录',
    [MenuType.Menu]: '菜单',
    [MenuType.Button]: '按钮',
  }
  return types[type] || '未知'
}

const getTypeTag = (type: MenuType): string => {
  const types: Record<MenuType, string> = {
    [MenuType.Directory]: 'primary',
    [MenuType.Menu]: 'success',
    [MenuType.Button]: 'warning',
  }
  return types[type] || 'info'
}

const resetForm = () => {
  form.name = ''
  form.type = MenuType.Directory
  form.parentId = null
  form.path = ''
  form.component = ''
  form.permission = ''
  form.icon = ''
  form.sort = 0
  form.hidden = MenuHidden.Visible
  form.status = MenuStatus.Enabled
  form.appId = currentAppId.value || 0
}

const handleAdd = (parent: Menu | null) => {
  resetForm()
  isEdit.value = false
  dialogTitle.value = '新增菜单'
  if (parent) {
    form.parentId = parent.id
    form.type = parent.type === MenuType.Directory ? MenuType.Menu : MenuType.Button
  }
  dialogVisible.value = true
}

const handleEdit = (row: Menu) => {
  resetForm()
  isEdit.value = true
  dialogTitle.value = '编辑菜单'
  currentMenuId.value = row.id
  form.name = row.name
  form.type = row.type as MenuType
  form.parentId = row.parentId
  form.path = row.path
  form.component = row.component
  form.permission = row.permission
  form.icon = row.icon
  form.sort = row.sort
  form.hidden = row.hidden as MenuHidden
  form.status = row.status as MenuStatus
  form.appId = row.appId
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
      await menuApi.update({ ...form, id: currentMenuId.value })
      ElMessage.success('修改成功')
    } else {
      await menuApi.create(form)
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

const handleStatusChange = async (row: Menu, status: number | boolean) => {
  try {
    await menuApi.updateStatus(row.id, status as number)
    ElMessage.success('状态更新成功')
    fetchTree()
  } catch (error) {
    console.error('状态更新失败', error)
  }
}

const handleDelete = async (row: Menu) => {
  if (row.children && row.children.length > 0) {
    ElMessage.warning('请先删除子菜单')
    return
  }
  try {
    await ElMessageBox.confirm('确定要删除该菜单吗？', '提示', {
      type: 'warning',
    })
    await menuApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchTree()
  } catch (error) {
    console.error('删除失败', error)
  }
}

onMounted(() => {
  fetchApps()
})
</script>

<style lang="scss" scoped>
.menu-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      align-items: center;
    }
  }
}
</style>
