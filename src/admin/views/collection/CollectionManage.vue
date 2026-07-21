<template>
  <div class="page">
    <div class="toolbar">
      <el-input v-model="query" placeholder="请输入用户名" clearable style="width: 200px" @keyup.enter="handleSearch" />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="userName" label="用户" width="120" />
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">{{ row.type === 0 ? '歌曲' : '歌单' }}</template>
      </el-table-column>
      <el-table-column prop="songName" label="关联歌曲/歌单" show-overflow-tooltip />
      <el-table-column prop="createTime" label="收藏时间" width="180" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="currentPage" @current-change="fetchData" />

    <DelDialog ref="delDialogRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllCollection, deleteCollection } from '@/api'
import DelDialog from '@/admin/components/DelDialog.vue'

const query = ref('')
const tableData = ref([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const loading = ref(false)
const delDialogRef = ref(null)

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getAllCollection()
    const list = res.data || res || []
    tableData.value = query.value ? list.filter(s => s.userName?.includes(query.value)) : list
    total.value = tableData.value.length
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { currentPage.value = 1; fetchData() }

const handleDelete = async (row) => {
  const ok = await delDialogRef.value.open()
  if (ok) { await deleteCollection(row.id); fetchData() }
}

onMounted(fetchData)
</script>

<style scoped>
.toolbar { margin-bottom: 20px; display: flex; gap: 10px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>
