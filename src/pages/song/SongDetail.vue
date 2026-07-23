<template>
  <div class="song-page">
    <div class="card" v-if="song">
      <div class="back" @click="$router.back()">← 返回</div>
      <div class="top-panel">
        <img :src="getImage(song.pic)" class="cover" />
        <div class="info-right">
          <div class="title">{{ song.name }}</div>
          <div class="basic-info">
            <span v-if="song.singerUserId" class="artist-link" @click="$router.push('/user-page/' + song.singerUserId)">
              歌手：{{ song.singerName || song.singer || song.introduction || '未知' }}
            </span>
            <span v-else>歌手：{{ song.singerName || song.singer || song.introduction || '未知' }}</span>
            <span>▶ {{ fmtCount(song.playCount) }}</span>
            <span>{{ fmtDate(song.createTime) }}</span>
          </div>
          <div class="button-row">
            <span class="btn play" @click="playCurrentSong">
              <el-icon><VideoPlay /></el-icon> 播放
            </span>
            <span class="btn" @click="addToQueueSong">
              <el-icon><List /></el-icon> 加入播放列表
            </span>
            <span class="btn collect" @click="toggleCollect">
              <el-icon><component :is="song.isCollected ? StarFilled : Star" /></el-icon> 收藏
            </span>
            <a class="btn download" :href="song.url" :download="song.name">
              <el-icon><Download /></el-icon> 下载
            </a>
          </div>
        </div>
      </div>

      <!-- 歌词 -->
      <div class="lyrics-section">
        <h3>歌词</h3>
        <div v-if="lyricsText" class="lyrics-body">
          <div v-if="!showAll">{{ shortLyrics }}</div>
          <div v-else class="full-lyrics">{{ lyricsText }}</div>
          <el-button v-if="lyricsText.length > 200" type="text" @click="showAll = !showAll">{{ showAll ? '收起歌词' : '展开全部歌词' }}</el-button>
        </div>
        <div v-else class="lyrics-empty">暂无歌词</div>
      </div>

      <!-- 评论 -->
      <div class="comments">
        <h3>评论（{{ song.commentCount || comments.length }}）</h3>
        <div class="comment-form">
          <el-input type="textarea" v-model="newComment" :rows="3" placeholder="写下你的评论..." />
          <div style="margin-top:8px;text-align:right;">
            <el-button type="primary" @click="submitComment">发表评论</el-button>
          </div>
        </div>
        <div class="comment-list">
          <div class="comment-item" v-for="c in comments" :key="c.id">
            <div class="comment-user">{{ c.username || c.userId || '匿名' }}</div>
            <div class="comment-content">{{ c.content }}</div>
            <div class="comment-time">{{ formatTime(c.createTime) }}</div>
            <div class="comment-actions">
              <span class="like-btn" :class="{ liked: c.isLiked }" @click="toggleCommentLike(c)">
                <el-icon><component :is="c.isLiked ? StarFilled : Star" /></el-icon>
                <span class="like-count">{{ c.likeCount || 0 }}</span>
              </span>
              <el-button size="mini" type="text" @click="replyVisible[c.id] = !replyVisible[c.id]">回复</el-button>
              <el-button v-if="c.userId && c.userId==userId" size="mini" type="text" @click="removeComment(c.id)">删除</el-button>
            </div>
            <div v-if="replyVisible[c.id]" class="reply-box">
              <el-input type="textarea" v-model="replyTexts[c.id]" :rows="2" placeholder="写回复..." />
              <div style="text-align:right;margin-top:8px;">
                <el-button size="small" type="primary" @click="submitReply(c.id)">发送回复</el-button>
              </div>
            </div>
            <div class="replies" v-if="c.replies && c.replies.length">
              <div class="reply-item" v-for="r in c.replies" :key="r.id">
                <div class="comment-user">{{ r.username || r.userId || '匿名' }} 回复</div>
                <div class="comment-content">{{ r.content }}</div>
                <div class="comment-time">{{ formatTime(r.createTime) }}</div>
                <div class="comment-actions">
                  <span class="like-btn" :class="{ liked: r.isLiked }" @click="toggleCommentLike(r)">
                    <el-icon><component :is="r.isLiked ? StarFilled : Star" /></el-icon>
                    <span class="like-count">{{ r.likeCount || 0 }}</span>
                  </span>
                  <el-button v-if="r.userId && r.userId==userId" size="mini" type="text" @click="removeComment(r.id)">删除</el-button>
                </div>
              </div>
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
import { getSongDetail, collectSong, getSongComments, addSongComment, deleteSongComment, likeSongComment } from '@/api/song'
import { attachImageUrl } from '@/utils'
import { Star, StarFilled, Download, VideoPlay, List } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { usePlayQueue } from '@/store/playQueue'

const route = useRoute()
const song = ref(null)
const comments = ref([])
const newComment = ref('')
const replyTexts = ref({})
const replyVisible = ref({})
const showAll = ref(false)
const userStore = useUserStore()
const userId = computed(() => userStore.userId)
const queue = usePlayQueue()

function getImage(path) { return attachImageUrl(path) }

function fmtCount(n) { if (!n) return '0'; if (n >= 10000) return (n / 10000).toFixed(1) + '万'; return String(n) }

function fmtDate(t) {
  if (!t) return ''
  const d = new Date(t)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

const lyricsText = computed(() => {
  if (!song.value) return ''
  return song.value.lyric || song.value.lyrics || ''
})

const shortLyrics = computed(() => {
  const t = lyricsText.value
  if (!t) return ''
  return t.length > 200 ? t.slice(0, 200) + '...' : t
})

function playCurrentSong() {
  if (!song.value) return
  queue.playSong({
    id: song.value.id, name: song.value.name,
    artist: song.value.singerName || song.value.singer || song.value.introduction || '未知',
    cover: getImage(song.value.pic), singerUserId: song.value.singerUserId,
    url: song.value.url && song.value.url.includes('://') ? song.value.url : attachImageUrl(song.value.url)
  })
}

function addToQueueSong() {
  if (!song.value) return
  const s = song.value
  const item = {
    id: s.id, name: s.name,
    artist: s.singerName || s.singer || s.introduction || '未知',
    cover: getImage(s.pic), singerUserId: s.singerUserId,
    url: s.url && s.url.includes('://') ? s.url : attachImageUrl(s.url)
  }
  const exists = queue.queue.find(q => q.id === item.id)
  if (exists) { ElMessage.warning('该歌曲已在播放列表中'); return }
  queue.queue.push(item)
  ElMessage.success('已加入播放列表')
}

function formatTime(time) {
  if (!time) return ''
  const d = new Date(time)
  const now = new Date()
  const diffMs = now - d
  const oneHour = 1000 * 60 * 60
  const oneDay = oneHour * 24
  if (diffMs >= 0 && diffMs < oneDay) {
    const hours = Math.floor(diffMs / oneHour)
    if (hours >= 1) return hours + '小时前'
    const minutes = Math.floor(diffMs / (1000 * 60))
    if (minutes >= 1) return minutes + '分钟前'
    return '刚刚'
  }
  const pad = (n) => String(n).padStart(2, '0')
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
}

async function loadData() {
  const id = route.params.id
  try {
    const res = await getSongDetail(id)
    song.value = res.data.data
    if (song.value && song.value.isCollected === undefined) song.value.isCollected = false
    await loadComments()
  } catch (e) { song.value = null }
}

async function toggleCollect() {
  if (!userId.value) { ElMessage.error('请先登录'); return }
  try {
    await collectSong({ userId: userId.value, songId: route.params.id })
    if (!song.value) return
    song.value.isCollected = !song.value.isCollected
    ElMessage.success(song.value.isCollected ? '已收藏' : '已取消收藏')
  } catch (e) { ElMessage.error('操作失败') }
}

async function loadComments() {
  try {
    const res = await getSongComments(route.params.id, userId.value || undefined)
    const raw = res.data.data || []
    const map = {}
    raw.forEach(c => { c.replies = []; map[c.id] = c })
    const roots = []
    raw.forEach(c => {
      if (c.parentId && map[c.parentId]) { map[c.parentId].replies.push(c) }
      else { roots.push(c) }
    })
    comments.value = roots
  } catch (e) { comments.value = [] }
}

async function submitComment() {
  if (!newComment.value || !newComment.value.trim()) { ElMessage.error('评论内容不能为空'); return }
  try {
    if (!userId.value) { ElMessage.error('请先登录'); return }
    await addSongComment({ targetId: Number(route.params.id), userId: Number(userId.value), content: newComment.value.trim() })
    ElMessage.success('评论已发布')
    newComment.value = ''
    await loadComments()
    if (song.value) song.value.commentCount = comments.value.reduce((sum, c) => sum + 1 + (c.replies ? c.replies.length : 0), 0)
  } catch (e) { ElMessage.error('评论失败') }
}

async function submitReply(commentId) {
  const text = (replyTexts.value[commentId] || '').trim()
  if (!text) { ElMessage.error('回复内容不能为空'); return }
  if (!userId.value) { ElMessage.error('请先登录'); return }
  try {
    await addSongComment({ targetId: Number(route.params.id), userId: Number(userId.value), content: text, parentId: commentId })
    ElMessage.success('回复已发布')
    replyTexts.value[commentId] = ''
    replyVisible.value[commentId] = false
    await loadComments()
    if (song.value) song.value.commentCount = comments.value.reduce((sum, c) => sum + 1 + (c.replies ? c.replies.length : 0), 0)
  } catch (e) { ElMessage.error('回复失败') }
}

async function removeComment(id) {
  if (!userId.value) { ElMessage.error('请先登录'); return }
  try {
    await deleteSongComment(id, userId.value)
    ElMessage.success('评论已删除')
    await loadComments()
    if (song.value) song.value.commentCount = comments.value.reduce((sum, c) => sum + 1 + (c.replies ? c.replies.length : 0), 0)
  } catch (e) { ElMessage.error('删除失败') }
}

async function toggleCommentLike(c) {
  if (!userId.value) { ElMessage.error('请先登录'); return }
  try {
    await likeSongComment({ userId: Number(userId.value), commentId: c.id })
    if (c.isLiked) {
      c.isLiked = false
      c.likeCount = Math.max(0, (c.likeCount || 1) - 1)
    } else {
      c.isLiked = true
      c.likeCount = (c.likeCount || 0) + 1
    }
  } catch (e) { ElMessage.error('点赞失败') }
}

onMounted(() => { loadData() })
</script>

<style scoped>
.song-page { padding: 24px; max-width: 1000px; margin: 0 auto; padding-bottom: 100px; }
.card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
.back { cursor: pointer; color: #666; margin-bottom: 12px; display: inline-block; }
.top-panel { display: flex; gap: 24px; align-items: flex-start; margin-bottom: 24px; }
.cover { width: 200px; height: 200px; border-radius: 50%; object-fit: cover; border: 3px solid #eee; }
.info-right { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.title { font-size: 28px; font-weight: 700; color: #111; }
.basic-info { display: flex; flex-wrap: wrap; gap: 18px; color: #666; font-size: 14px; }
.button-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.artist-link { color: #ec4141; cursor: pointer; }
.artist-link:hover { text-decoration: underline; }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 999px; border: 1px solid #ccc; color: #333; cursor: pointer; background: #fff; transition: all 0.2s ease; font-size: 14px; }
.btn:hover { background: #f5f5f5; }
.btn.download { text-decoration: none; }

.lyrics-section { margin-top: 16px; padding: 16px; background: #fafafa; border-radius: 8px; }
.lyrics-section h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
.lyrics-body { line-height: 2; color: #444; }
.full-lyrics { white-space: pre-wrap; }
.lyrics-empty { color: #999; font-size: 14px; }

.comments { margin-top: 20px; }
.comment-list { display: flex; flex-direction: column; gap: 12px; margin-top: 12px; }
.comment-item { padding: 10px; background: #fafafa; border-radius: 8px; }
.comment-user { font-weight: 600; }
.comment-content { margin-top: 4px; color: #444; }
.comment-time { color: #999; font-size: 12px; margin-top: 6px; }
.comment-actions { margin-top: 8px; display: flex; align-items: center; gap: 8px; }
.like-btn { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; color: #bbb; user-select: none; }
.like-btn.liked { color: #f6a900; }
.like-btn .like-count { font-size: 13px; color: inherit; }
.reply-box { margin-top: 8px; }
.replies { margin-top: 10px; padding-left: 12px; border-left: 2px solid #f0f0f0; display: flex; flex-direction: column; gap: 8px; }
.reply-item { padding: 8px; background: #fff; border-radius: 6px; }
</style>