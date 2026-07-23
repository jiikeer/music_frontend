<template>
  <div class="artist-page">
    <div v-if="artist" class="artist-card">
      <img :src="getImage(artist.avatar)" class="artist-pic" />
      <div class="artist-info">
        <h1 class="artist-name">{{ artist.username || artist.name || '未知用户' }}</h1>
        <p class="artist-intro">{{ artist.introduction || '这个用户很懒，什么都没写~' }}</p>
        <div class="artist-meta">
          <span v-if="totalSongs !== null">共 {{ totalSongs }} 首歌曲</span>
        </div>
      </div>
    </div>
    <div v-else class="artist-card">
      <p style="color:#999;">加载中...</p>
    </div>

    <div class="songs-section">
      <h2>全部作品</h2>
      <div class="song-list" v-if="songs.length">
        <div class="song-item" v-for="s in songs" :key="s.id">
          <img :src="getImage(s.pic)" class="song-cover" @click.stop="$router.push(`/song/detail/${s.id}`)" />
          <div class="song-info" @click="playSong(s)">
            <div class="song-name">{{ s.name }}</div>
            <div class="song-meta">
              <span>▶ {{ s.playCount || 0 }}</span>
              <span style="margin-left:12px;color:#bbb;">{{ formatTime(s.createTime) }}</span>
            </div>
          </div>
          <el-button size="small" text @click.stop="addToList(s)">加入列表</el-button>
          <el-button size="small" @click.stop="$router.push(`/song/detail/${s.id}`)">详情</el-button>
        </div>
      </div>
      <el-empty v-else description="该用户暂无作品" />
      <el-pagination
        v-if="totalSongs > pageSize"
        class="pagination"
        background
        layout="prev, pager, next"
        :total="totalSongs"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="loadSongs"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/utils/request'
import { attachImageUrl } from '@/utils'
import { usePlayQueue } from '@/store/playQueue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const queue = usePlayQueue()
const artist = ref(null)
const songs = ref([])
const totalSongs = ref(null)
const pageSize = ref(20)
const currentPage = ref(1)

function getImage(path) { return attachImageUrl(path) }

function formatTime(time) {
  if (!time) return ''
  const d = new Date(time)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function playSong(s) {
  queue.playSong({
    id: s.id, name: s.name,
    artist: s.singerName || s.singer || artist.value?.username || '未知',
    cover: getImage(s.pic), singerUserId: s.singerUserId,
    url: s.url?.includes('://') ? s.url : attachImageUrl(s.url)
  })
}

function addToList(s) {
  const item = {
    id: s.id, name: s.name,
    artist: s.singerName || s.singer || artist.value?.username || '未知',
    cover: getImage(s.pic), singerUserId: s.singerUserId,
    url: s.url?.includes('://') ? s.url : attachImageUrl(s.url)
  }
  if (queue.queue.find(q => q.id === item.id)) { ElMessage.warning('已在播放列表中'); return }
  queue.queue.push(item)
  ElMessage.success('已加入播放列表')
}

async function loadUser() {
  const userId = route.params.id
  try {
    const res = await api({ url: `/user/detail?id=${userId}` })
    // api() returns the R object directly: { code, success, data: {...} }
    artist.value = res?.data || {}
  } catch (e) {
    console.error('加载用户信息失败', e)
    artist.value = null
  }
}

async function loadSongs() {
  const userId = route.params.id
  try {
    const res = await api({
      url: '/song/singer-songs',
      params: { singerUserId: userId, page: currentPage.value, size: pageSize.value }
    })
    // api() returns { code, data: { records, total, ... } }
    const records = res?.data?.records || []
    songs.value = Array.isArray(records) ? records : []
    totalSongs.value = res?.data?.total ?? songs.value.length
  } catch (e) {
    console.error('加载作品失败', e)
    songs.value = []
  }
}

onMounted(async () => {
  await loadUser()
  loadSongs()
})
</script>

<style scoped>
.artist-page { display: flex; flex-direction: column; gap: 24px; padding: 24px; }
.artist-card {
  display: flex;
  gap: 32px;
  padding: 32px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  align-items: center;
}
.artist-pic { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; flex-shrink: 0; background: #eee; }
.artist-name { font-size: 32px; font-weight: 700; margin-bottom: 12px; }
.artist-intro { font-size: 15px; color: #666; line-height: 1.7; max-width: 600px; margin-bottom: 12px; }
.artist-meta { font-size: 14px; color: #999; }
.songs-section { background: #fff; border-radius: 20px; padding: 24px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06); }
.songs-section h2 { font-size: 20px; margin-bottom: 16px; }
.song-list { display: flex; flex-direction: column; gap: 12px; }
.song-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.song-item:hover { background: #f5f5f5; }
.song-cover { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; }
.song-info { flex: 1; }
.song-name { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.song-meta { font-size: 12px; color: #999; }
.pagination { margin-top: 16px; justify-content: flex-end; }
</style>
