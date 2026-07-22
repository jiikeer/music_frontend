<template>
  <div class="page">
    <div class="toolbar">
      <el-input v-model="query" placeholder="请输入歌单标题" clearable style="width: 200px" @keyup.enter="handleSearch" />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="openDialog()">新增歌单</el-button>
    </div>

    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="歌单标题" />
      <el-table-column prop="introduction" label="简介" show-overflow-tooltip />
      <el-table-column prop="style" label="风格" width="100" />
      <el-table-column label="封面" width="80">
        <template #default="{ row }">
          <el-image v-if="row.pic" :src="row.pic" style="width: 40px; height: 40px" :preview-src-list="[row.pic]" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="currentPage" @current-change="fetchData" />

    <el-dialog :title="isEdit ? '编辑歌单' : '新增歌单'" v-model="dialogVisible" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="风格"><el-input v-model="form.style" /></el-form-item>
        <el-form-item label="简介"><el-input v-model="form.introduction" type="textarea" /></el-form-item>
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
import { getAllSongSheet, addSongSheet, updateSongSheet, deleteSongSheet } from '@/api'
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
    const res = await getAllSongSheet()
    const list = res.data || res || []
    tableData.value = query.value ? list.filter(s => s.title?.includes(query.value)) : list
    total.value = tableData.value.length
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { currentPage.value = 1; fetchData() }

const openDialog = (row) => {
  isEdit.value = !!row
  form.value = row ? { ...row } : {}
  dialogVisible.value = true
}

const submit = async () => {
  if (isEdit.value) await updateSongSheet(form.value)
  else await addSongSheet(form.value)
  dialogVisible.value = false
  fetchData()
}

const handleDelete = async (row) => {
  const ok = await delDialogRef.value.open()
  if (ok) { await deleteSongSheet(row.id); fetchData() }
}

onMounted(fetchData)
</script>

<style scoped>
.toolbar { margin-bottom: 20px; display: flex; gap: 10px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>
