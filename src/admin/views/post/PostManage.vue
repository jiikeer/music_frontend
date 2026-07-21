<template>
  <div class="page">
    <div class="toolbar">
      <el-input v-model="query" placeholder="请输入帖子标题" clearable style="width: 200px" @keyup.enter="handleSearch" />
      <el-select v-model="status" placeholder="审核状态" clearable style="width: 140px">
        <el-option label="待审核" :value="0" />
        <el-option label="已通过" :value="1" />
        <el-option label="已驳回" :value="2" />
      </el-select>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" show-overflow-tooltip />
      <el-table-column prop="username" label="发布用户" width="120" />
      <el-table-column prop="status" label="审核状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="audit_reason" label="审核理由" show-overflow-tooltip />
      <el-table-column prop="like_count" label="点赞数" width="80" />
      <el-table-column prop="comment_count" label="评论数" width="80" />
      <el-table-column prop="create_time" label="发布时间" width="180" />
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button size="small" v-if="row.status === 0" type="success" @click="handleAudit(row, 1)">通过</el-button>
          <el-button size="small" v-if="row.status === 0" type="danger" @click="openRejectDialog(row)">驳回</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="currentPage" @current-change="fetchData" />

    <el-dialog title="驳回原因" v-model="rejectDialogVisible" width="400px">
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="驳回理由">
          <el-input v-model="rejectForm.auditReason" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="submitReject">确定驳回</el-button>
      </template>
    </el-dialog>

    <DelDialog ref="delDialogRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminPostPage, auditPost, adminDeletePost } from '@/api'
import { ElMessage } from 'element-plus'
import DelDialog from '@/admin/components/DelDialog.vue'

const query = ref('')
const status = ref('')
const tableData = ref([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const loading = ref(false)
const rejectDialogVisible = ref(false)
const rejectForm = ref({ auditReason: '' })
const rejectRow = ref(null)
const delDialogRef = ref(null)

const getStatusText = (s) => {
  const map = { 0: '待审核', 1: '已通过', 2: '已驳回' }
  return map[s] || '未知'
}

const getStatusType = (s) => {
  const map = { 0: 'warning', 1: 'success', 2: 'danger' }
  return map[s] || ''
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getAdminPostPage(currentPage.value, pageSize.value, status.value === '' ? undefined : status.value)
    const raw = res?.data ?? res ?? {}
    const list = Array.isArray(raw.records) ? raw.records : Array.isArray(raw.list) ? raw.list : Array.isArray(raw) ? raw : []
    tableData.value = list
    total.value = raw.total ?? list.length
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { currentPage.value = 1; fetchData() }

const handleAudit = async (row, status) => {
  await auditPost({ postId: row.id, status })
  ElMessage.success('审核成功')
  fetchData()
}

const openRejectDialog = (row) => {
  rejectRow.value = row
  rejectForm.value = { auditReason: '' }
  rejectDialogVisible.value = true
}

const submitReject = async () => {
  if (!rejectForm.value.auditReason) {
    ElMessage.warning('请填写驳回理由')
    return
  }
  await auditPost({ postId: rejectRow.value.id, status: 2, auditReason: rejectForm.value.auditReason })
  rejectDialogVisible.value = false
  ElMessage.success('驳回成功')
  fetchData()
}

const handleDelete = async (row) => {
  const ok = await delDialogRef.value.open()
  if (ok) { await adminDeletePost(row.id); ElMessage.success('删除成功'); fetchData() }
}

onMounted(fetchData)
</script>

<style scoped>
.toolbar { margin-bottom: 20px; display: flex; gap: 10px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>
