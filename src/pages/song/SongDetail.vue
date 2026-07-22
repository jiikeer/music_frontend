<template>
  <div class="song-detail">
    <div class="card" v-if="song">
      <div class="back" @click="$router.back()">← 返回</div>
      <h1>{{ song.name }}</h1>
      <img :src="getImage(song.cover)" class="cover" />

      <div class="meta">
        <div class="artist">{{ song.artist }}</div>
        <div class="actions">
          <span class="collect" @click="toggleCollect" style="cursor:pointer;">
            <el-icon>
              <component :is="song.isCollected ? StarFilled : Star" />
            </el-icon>
            <span>{{ song.collectCount || 0 }}</span>
          </span>
          <a :href="song.url" :download="song.name" class="download" title="下载歌曲">
            <el-icon><Download /></el-icon>
          </a>
        </div>
      </div>

      <audio :src="song.url" controls class="player" />

      <div class="lyrics">
        <div v-if="!showAll">{{ shortLyrics }}</div>
        <div v-else class="full-lyrics">{{ song.lyrics }}</div>
        <el-button type="text" @click="showAll = !showAll">{{ showAll ? '收起歌词' : '展开全部歌词' }}</el-button>
      </div>

      <div class="comments">
        <h3>评论（{{ song.commentCount || comments.length }}）</h3>
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

        <div class="comment-form">
          <el-input type="textarea" v-model="newComment" :rows="3" placeholder="写下你的评论..." />
          <div style="margin-top:8px;text-align:right;">
            <el-button type="primary" @click="submitComment">发表评论</el-button>
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
import { Star, StarFilled, Download } from '@element-plus/icons-vue'
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

const shortLyrics = computed(()=>{
  if(!song.value || !song.value.lyrics) return ''
  const t = song.value.lyrics
  return t.length>200 ? t.slice(0,200)+'...' : t
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
.cover{ width:100%;max-width:560px;height:320px;object-fit:cover;border-radius:8px;margin:12px 0 }
.meta{ display:flex;align-items:center;justify-content:space-between }
.artist{ font-size:16px;color:#666 }
.actions{ display:flex;gap:12px;align-items:center }
.collect{ display:flex;align-items:center;gap:6px;color:#999 }
.download .el-icon{ color:#444 }
.lyrics{ margin-top:16px }
.full-lyrics{ white-space:pre-wrap }
.comments{ margin-top:20px }
.comment-list{ display:flex;flex-direction:column;gap:12px;margin-top:12px }
.comment-item{ padding:10px;background:#fafafa;border-radius:8px }
.comment-user{ font-weight:600 }
.comment-time{ color:#999;font-size:12px;margin-top:6px }
</style>
