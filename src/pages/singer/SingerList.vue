<template>
  <div class="singer-page">
    <div class="page-header">
      <h1>校园原创歌手</h1>
      <p>展示所有发布过作品的校园音乐人</p>
    </div>
    <div class="singer-grid" v-loading="loading">
      <div v-for="u in singers" :key="u.id" class="singer-card" @click="$router.push('/user-page/' + u.id)">
        <img :src="getImg(u.avatar)" class="singer-avatar" />
        <div class="singer-name">{{ u.username || '未知' }}</div>
        <div class="singer-sub">{{ u.introduction || '校园音乐人' }}</div>
      </div>
    </div>
    <el-empty v-if="!loading && singers.length === 0" description="暂无歌手" />
    <el-pagination v-if="total > pageSize" class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="currentPage" @current-change="loadData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/utils/request'
import { attachImageUrl } from '@/utils'

const singers = ref([])
const loading = ref(false)
const total = ref(0)
const pageSize = 20
const currentPage = ref(1)

function getImg(p) { return attachImageUrl(p) }

async function loadData() {
  loading.value = true
  try {
    const res = await api({ url: '/user/page', params: { page: currentPage.value, size: pageSize } })
    const d = res?.data || {}
    const list = d?.records || (Array.isArray(d) ? d : [])
    singers.value = list.filter(u => u.username !== 'admin')
    total.value = d?.total || singers.value.length
  } catch (e) { console.error(e) } finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.singer-page { max-width: 1200px; margin: 0 auto; padding: 0 16px 100px; }
.page-header { text-align: center; padding: 32px 0 24px; }
.page-header h1 { font-size: 28px; font-weight: 700; color: #333; margin-bottom: 6px; }
.page-header p { font-size: 14px; color: #999; }
.singer-grid { display: flex; flex-wrap: wrap; gap: 20px; justify-content: flex-start; }
.singer-card { width: calc(20% - 16px); display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 24px 16px; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
.singer-card:hover { transform: translateY(-4px); box-shadow: 0 6px 20px rgba(0,0,0,0.10); }
.singer-avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid #eee; }
.singer-name { font-size: 16px; font-weight: 600; color: #333; }
.singer-sub { font-size: 13px; color: #999; }
.pagination { margin-top: 24px; justify-content: center; }
@media (max-width: 1000px) { .singer-card { width: calc(25% - 15px); } }
@media (max-width: 768px) { .singer-card { width: calc(50% - 10px); } }
</style>