<template>
  <div class="page">
    <div class="toolbar">
      <el-button type="success" @click="openDialog()">新增轮播图</el-button>
    </div>

    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column label="图片" width="120">
        <template #default="{ row }">
          <el-image v-if="row.pic" :src="row.pic" style="width: 100px; height: 50px" :preview-src-list="[row.pic]" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="introduction" label="描述" show-overflow-tooltip />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="currentPage" @current-change="fetchData" />

    <el-dialog :title="isEdit ? '编辑轮播图' : '新增轮播图'" v-model="dialogVisible" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.introduction" type="textarea" /></el-form-item>
        <el-form-item label="图片">
          <el-upload action="" :show-file-list="false" :before-upload="(file) => handleUpload(file)">
            <el-button>选择图片</el-button>
          </el-upload>
          <el-image v-if="form.pic" :src="form.pic" style="width: 100px; margin-top: 10px" />
        </el-form-item>
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
import { getAllBanner, addBanner, updateBanner, deleteBanner, uploadBannerPic } from '@/api'
import { beforeUpload } from '@/utils/mixin'
import { ElMessage } from 'element-plus'
import DelDialog from '@/admin/components/DelDialog.vue'

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
    const res = await getAllBanner()
    const list = res.data || res || []
    tableData.value = list
    total.value = list.length
  } finally {
    loading.value = false
  }
}

const openDialog = (row) => {
  isEdit.value = !!row
  form.value = row ? { ...row } : {}
  dialogVisible.value = true
}

const handleUpload = async (file) => {
  const valid = beforeUpload(file)
  if (valid !== true) { ElMessage.error(valid); return false }
  if (form.value.id) {
    const res = await uploadBannerPic(form.value.id, file)
    form.value.pic = res.data || res
    ElMessage.success('上传成功')
  } else {
    ElMessage.warning('请先保存基础信息再上传图片')
  }
  return false
}

const submit = async () => {
  if (isEdit.value) await updateBanner(form.value)
  else await addBanner(form.value)
  dialogVisible.value = false
  fetchData()
}

const handleDelete = async (row) => {
  const ok = await delDialogRef.value.open()
  if (ok) { await deleteBanner(row.id); fetchData() }
}

onMounted(fetchData)
</script>

<style scoped>
.toolbar { margin-bottom: 20px; }
.pagination { margin-top: 20px; justify-content: flex-end; }
</style>
