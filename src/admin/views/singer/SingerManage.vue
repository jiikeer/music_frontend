<template>
  <div class="page">
    <div class="toolbar">
      <el-input v-model="query" placeholder="请输入歌手名" clearable style="width: 200px" @keyup.enter="handleSearch" />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button type="success" @click="openDialog()">新增歌手</el-button>
    </div>

    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="sex" label="性别" width="80">
        <template #default="{ row }">{{ getSex(row.sex) }}</template>
      </el-table-column>
      <el-table-column prop="birth" label="出生日期" />
      <el-table-column prop="location" label="地区" />
      <el-table-column prop="introduction" label="简介" show-overflow-tooltip />
      <el-table-column label="头像" width="80">
        <template #default="{ row }">
          <el-image v-if="row.pic" :src="row.pic" style="width: 40px; height: 40px; border-radius: 50%" :preview-src-list="[row.pic]" />
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

    <el-dialog :title="isEdit ? '编辑歌手' : '新增歌手'" v-model="dialogVisible" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex">
            <el-option label="女" :value="0" />
            <el-option label="男" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="form.birth" type="date" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="地区"><el-input v-model="form.location" /></el-form-item>
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
import { getAllSinger, addSinger, updateSinger, deleteSinger } from '@/api'
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
    const res = await getAllSinger()
    const list = res.data || res || []
    tableData.value = query.value ? list.filter(s => s.name?.includes(query.value)) : list
    total.value = tableData.value.length
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { currentPage.value = 1; fetchData() }

const openDialog = (row) => {
  isEdit.value = !!row
  form.value = row ? { ...row } : { sex: 1 }
  dialogVisible.value = true
}

const submit = async () => {
  if (isEdit.value) await updateSinger(form.value)
  else await addSinger(form.value)
  dialogVisible.value = false
  fetchData()
}

const handleDelete = async (row) => {
  const ok = await delDialogRef.value.open()
  if (ok) { await deleteSinger(row.id); fetchData() }
}

onMounted(fetchData)
</script>

<style scoped>
.toolbar { margin-bottom: 20px; display: flex; gap: 10px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>
