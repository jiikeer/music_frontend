<template>
  <div class="rank-page">
    <div class="page-header">
      <h1>校园总榜</h1>
      <p>按全平台歌曲播放量排序，每日更新</p>
    </div>
    <div class="rank-list" v-loading="loading">
      <div v-for="(s, idx) in songs" :key="s.id" class="rank-item" @click="playSong(s)">
        <span :class="['rank-idx', idx < 3 ? 'idx-top' : 'idx-norm']">{{ (currentPage - 1) * pageSize + idx + 1 }}</span>
        <img :src="getImg(s.pic)" class="rank-cover" />
        <div class="rank-info">
          <div class="rank-name">{{ s.name }}</div>
          <div class="rank-meta">
            <span v-if="s.singerUserId" class="link-artist" @click.stop="$router.push('/user-page/' + s.singerUserId)">{{ s.singer || s.singerName || '未知' }}</span>
            <span v-else>{{ s.singer || s.singerName || s.introduction || '未知' }}</span>
            <span class="rank-extra">▶ {{ fmtCount(s.playCount) }}</span>
            <span v-if="s.duration" class="rank-dur">{{ fmtDur(s.duration) }}</span>
          </div>
        </div>
        <el-button size="small" text @click.stop="addToList(s)">加入列表</el-button>
        <el-button size="small" @click.stop="$router.push('/song/detail/' + s.id)">详情</el-button>
      </div>
    </div>
    <el-pagination v-if="total > pageSize" class="pagination" background layout="prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="currentPage" @current-change="loadData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/utils/request'
import { attachImageUrl } from '@/utils'
import { usePlayQueue } from '@/store/playQueue'
import { ElMessage } from 'element-plus'

const queue = usePlayQueue()
const songs = ref([])
const loading = ref(false)
const total = ref(0)
const pageSize = 20
const currentPage = ref(1)

function getImg(p) { return attachImageUrl(p) }
function fmtCount(n) { if (!n) return '0'; if (n >= 10000) return (n / 10000).toFixed(1) + '万'; return String(n) }
function fmtDur(sec) { if (!sec) return ''; return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0') }

function playSong(s) {
  queue.playSong({ id: s.id, name: s.name, artist: s.singer || s.singerName || s.introduction || '未知', cover: getImg(s.pic), singerUserId: s.singerUserId, url: s.url && s.url.includes('://') ? s.url : attachImageUrl(s.url) })
}

function addToList(s) {
  const item = { id: s.id, name: s.name, artist: s.singer || s.singerName || s.introduction || '未知', cover: getImg(s.pic), singerUserId: s.singerUserId, url: s.url && s.url.includes('://') ? s.url : attachImageUrl(s.url) }
  if (queue.queue.find(q => q.id === item.id)) { ElMessage.warning('该歌曲已在播放列表中'); return }
  queue.queue.push(item)
  ElMessage.success('已加入播放列表')
}

async function loadData() {
  loading.value = true
  try {
    const res = await api({ url: '/song/page', params: { page: currentPage.value, size: pageSize } })
    const d = res?.data || {}
    const list = d?.records || (Array.isArray(d) ? d : [])
    songs.value = list
    total.value = d?.total || list.length
  } catch (e) { console.error(e) } finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.rank-page { max-width: 1000px; margin: 0 auto; padding: 0 16px 100px; }
.page-header { text-align: center; padding: 32px 0 20px; }
.page-header h1 { font-size: 28px; font-weight: 700; color: #333; margin-bottom: 6px; }
.page-header p { font-size: 14px; color: #999; }
.rank-list { display: flex; flex-direction: column; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); padding: 8px 0; }
.rank-item { display: flex; align-items: center; gap: 14px; padding: 10px 20px; cursor: pointer; transition: background 0.2s; }
.rank-item:hover { background: #f5f5f7; }
.rank-idx { width: 32px; text-align: center; font-weight: 700; font-size: 16px; flex-shrink: 0; }
.idx-top { color: #ec4141; font-size: 22px; }
.idx-norm { color: #999; }
.rank-cover { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; flex-shrink: 0; }
.rank-info { flex: 1; min-width: 0; }
.rank-name { font-size: 15px; font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rank-meta { font-size: 12px; color: #999; margin-top: 3px; }
.link-artist { color: #ec4141; cursor: pointer; }
.link-artist:hover { text-decoration: underline; }
.rank-extra { margin-left: 8px; }
.rank-dur { margin-left: 4px; color: #bbb; }
.pagination { margin-top: 20px; justify-content: center; }
</style>