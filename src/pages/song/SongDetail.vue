<template>
  <div class="song-detail">
    <div class="card" v-if="song">
      <div class="back" @click="$router.back()">← 返回</div>
      <div class="top-panel">
        <img :src="getImage(song.cover)" class="cover" />
        <div class="info-right">
          <div class="title">{{ song.name }}</div>
          <div class="basic-info">
            <span>歌手：{{ song.artist }}</span>
          </div>
          <div class="button-row">
            <span class="btn play" @click="togglePlay">
              <el-icon><VideoPlay /></el-icon>
              {{ playing ? '暂停' : '播放' }}
            </span>
            <span class="btn collect" @click="toggleCollect">
              <el-icon><component :is="song.isCollected ? StarFilled : Star" /></el-icon>
              收藏
            </span>
            <a class="btn download" :href="song.url" :download="song.name">
              <el-icon><Download /></el-icon>
              下载
            </a>
            <span class="btn count">评论：{{ song.commentCount || comments.length }}</span>
          </div>
        </div>
      </div>
      <audio ref="audioRef" :src="song.url" preload="metadata" @ended="onEnded" @play="playing = true" @pause="playing = false" style="display:none" />

      <div class="lyrics">
        <div v-if="!showAll">{{ shortLyrics }}</div>
        <div v-else class="full-lyrics">{{ lyricsText }}</div>
        <el-button type="text" @click="showAll = !showAll">{{ showAll ? '收起歌词' : '展开全部歌词' }}</el-button>
      </div>

      <div class="comments">
          <div class="comment-form">
          <el-input type="textarea" v-model="newComment" :rows="3" placeholder="写下你的评论..." />
          <div style="margin-top:8px;text-align:right;">
            <el-button type="primary" @click="submitComment">发表评论</el-button>
          </div>
        <h3>评论（{{ song.commentCount || comments.length }}）</h3>
        </div>
        <div class="comment-list">
          <div class="comment-item" v-for="c in comments" :key="c.id">
            <div class="comment-user">{{ c.userName || c.userId || '匿名' }}</div>
            <div class="comment-content">{{ c.content }}</div>
            <div class="comment-time">{{ formatTime(c.createTime) }}</div>
            <div class="comment-actions">
              <el-button v-if="c.userId && c.userId==userId" size="mini" type="text" @click="removeComment(c.id)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getSongDetail, collectSong, getSongComments, addSongComment, deleteSongComment } from '@/api/song'
import { attachImageUrl } from '@/utils'
import { Star, StarFilled, Download, VideoPlay } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

const route = useRoute()
const song = ref(null)
const comments = ref([])
const newComment = ref('')
const showAll = ref(false)
const userStore = useUserStore()
const userId = computed(()=>userStore.userId)

function getImage(path){
  return attachImageUrl(path)
}

function formatTime(time){
  if(!time) return ''
  const d = new Date(time)
  const now = new Date()
  const diffMs = now - d
  const oneHour = 1000 * 60 * 60
  const oneDay = oneHour * 24
  if (diffMs >= 0 && diffMs < oneDay) {
      const hours = Math.floor(diffMs / oneHour)
      if (hours >= 1) return `${hours}小时前`
      const minutes = Math.floor(diffMs / (1000 * 60))
      if (minutes >= 1) return `${minutes}分钟前`
      return '刚刚'
  }
  const pad = (n)=>String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const lyricsText = computed(()=>{
  if(!song.value) return ''
  return song.value.lyrics || song.value.lyric || ''
})

const shortLyrics = computed(()=>{
  const text = lyricsText.value
  if(!text) return ''
  return text.length>200 ? text.slice(0,200)+'...' : text
})

async function loadData(){
  const id = route.params.id
  try{
    const res = await getSongDetail(id)
    song.value = res.data.data
    if(song.value && song.value.isCollected===undefined) song.value.isCollected = false
    await loadComments()
  }catch(e){
    song.value = null
  }
}

async function toggleCollect(){
  if(!userId.value){ ElMessage.error('请先登录'); return }
  try{
    await collectSong({ userId: userId.value, songId: route.params.id })
    if(!song.value) return
    song.value.isCollected = !song.value.isCollected
    ElMessage.success(song.value.isCollected ? '已收藏' : '已取消收藏')
  }catch(e){ ElMessage.error('操作失败') }
}

async function loadComments(){
  try{
    const res = await getSongComments(route.params.id)
    comments.value = res.data.data || []
  }catch(e){ comments.value = [] }
}

async function submitComment(){
  if(!newComment.value || !newComment.value.trim()){ ElMessage.error('评论内容不能为空'); return }
  try{
    await addSongComment({ songId: route.params.id, content: newComment.value })
    ElMessage.success('评论已发布')
    newComment.value = ''
    await loadComments()
    if(song.value) song.value.commentCount = comments.value.length
  }catch(e){ ElMessage.error('评论失败') }
}

async function removeComment(id){
  if(!userId.value){ ElMessage.error('请先登录'); return }
  try{
    await deleteSongComment(id, userId.value)
    ElMessage.success('评论已删除')
    await loadComments()
    if(song.value) song.value.commentCount = comments.value.length
  }catch(e){ ElMessage.error('删除失败') }
}

onMounted(()=>{ loadData() })
</script>

<style scoped>
.song-detail{ padding: 24px }
.card{ background:#fff;border-radius:12px;padding:20px;box-shadow:0 6px 20px rgba(0,0,0,0.06) }
.back{
  cursor:pointer;
  color:#666;
  margin-bottom:12px;
}
.top-panel{ display:flex; gap:24px; align-items:flex-start; margin-bottom:24px; }
.cover{ width:180px; height:180px; border-radius:50%; object-fit:cover; border: 3px solid #eee; }
.info-right{ flex:1; display:flex; flex-direction:column; gap:16px; }
.title{ font-size:28px; font-weight:700; color:#111; }
.basic-info{ display:flex; flex-wrap:wrap; gap:18px; color:#666; font-size:14px; }
.button-row{ display:flex; flex-wrap:wrap; gap:12px; align-items:center; }
.btn{ display:inline-flex; align-items:center; gap:6px; padding:10px 16px; border-radius:999px; border:1px solid #ccc; color:#333; cursor:pointer; background:#fff; transition:all .2s ease; }
.btn:hover{ background:#f5f5f5; }
.btn.download{ text-decoration:none; }
.btn.count{ border-color:transparent; color:#999; cursor:default; }
.lyrics{ margin-top:16px; line-height:2; color:#444; }
.full-lyrics{ white-space:pre-wrap; }
.full-lyrics{ white-space:pre-wrap }
.comments{ margin-top:20px }
.comment-list{ display:flex;flex-direction:column;gap:12px;margin-top:12px }
.comment-item{ padding:10px;background:#fafafa;border-radius:8px }
.comment-user{ font-weight:600 }
.comment-time{ color:#999;font-size:12px;margin-top:6px }
</style>
