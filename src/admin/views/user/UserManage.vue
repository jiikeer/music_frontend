<template>
  <div class="user-manage">
    <div class="toolbar">
      <el-input v-model="query" placeholder="请输入用户名" clearable style="width: 200px" @keyup.enter="handleSearch" />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="openDialog()">新增用户</el-button>
    </div>

    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="sex" label="性别" width="80">
        <template #default="{ row }">{{ getSex(row.sex) }}</template>
      </el-table-column>
      <el-table-column prop="phone_num" label="手机号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="birth" label="生日" />
      <el-table-column prop="introduction" label="签名" show-overflow-tooltip />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="currentPage" @current-change="handlePageChange" />

    <el-dialog :title="isEdit ? '编辑用户' : '新增用户'" v-model="dialogVisible" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
        <el-form-item v-if="!isEdit" label="密码"><el-input v-model="form.password" type="password" /></el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex">
            <el-option label="女" value="女" />
            <el-option label="男" value="男" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号"><el-input v-model="form.phone_num" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="form.birth" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="签名"><el-input v-model="form.introduction" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>

    <DelDialog ref="delDialogRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllUser, updateUser, register, deleteUser } from '@/api'
import { getSex } from '@/utils/mixin'
import DelDialog from '@/admin/components/DelDialog.vue'

const query = ref('')
const tableData = ref([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({})
const delDialogRef = ref(null)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getAllUser()
    const raw = res?.data ?? res
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.list) ? raw.list : []
    tableData.value = query.value ? list.filter(u => u.username?.includes(query.value)) : list
    total.value = tableData.value.length
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { currentPage.value = 1; fetchData() }
const handlePageChange = () => { fetchData() }

const openDialog = (row) => {
  isEdit.value = !!row
  form.value = row ? { ...row } : { sex: '男' }
  dialogVisible.value = true
}

const submit = async () => {
  if (isEdit.value) await updateUser(form.value)
  else await register(form.value)
  dialogVisible.value = false
  fetchData()
}

const handleDelete = async (row) => {
  const ok = await delDialogRef.value.open()
  if (ok) { await deleteUser(row.id); fetchData() }
}

onMounted(fetchData)
</script>

<style scoped>
.toolbar { margin-bottom: 20px; display: flex; gap: 10px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>
