<template>
  <transition name="fade">
    <div class="player-detail-overlay" v-if="visible" @click.self="close">
      <div class="player-detail-panel">
        <span class="close-btn" @click="close">✕</span>

        <!-- 左侧：封面 + 歌曲信息 -->
        <div class="left-section">
          <img :src="song.cover" alt="cover" class="big-cover" />
          <div class="song-name">{{ song.name }}</div>
          <div class="song-artist">{{ song.artist }}</div>
          <div class="song-info">
            <span v-if="detail.introduction">简介：{{ detail.introduction }}</span>
          </div>
        </div>

        <!-- 右侧：歌词 / 评论 -->
        <div class="right-section">
          <div class="tab-buttons">
            <button :class="{ active: activeTab === 'lyric' }" @click="activeTab = 'lyric'">歌词</button>
            <button :class="{ active: activeTab === 'comment' }" @click="activeTab = 'comment'">评论（{{ comments.length }}）</button>
          </div>

          <div class="tab-content" v-show="activeTab === 'lyric'">
            <div class="lyric-box" v-if="lyricText">
              {{ lyricText }}
            </div>
            <div class="no-lyric" v-else>暂无歌词</div>
          </div>

          <div class="tab-content comment-panel" v-show="activeTab === 'comment'">
            <div class="comment-form">
              <el-input type="textarea" v-model="newComment" :rows="3" placeholder="写下你的评论..." />
              <div style="margin-top:8px;text-align:right;">
                <el-button type="primary" @click="submitComment">发表评论</el-button>
              </div>
            </div>
            <div class="comment-list" v-if="comments.length">
              <div class="comment-item" v-for="c in comments" :key="c.id">
                <div class="comment-avatar">
                  <img v-if="c.avatar" :src="getImage(c.avatar)" />
                  <span v-else class="default-avatar">{{ (c.username || '?')[0] }}</span>
                </div>
                <div class="comment-body">
                  <div class="comment-header">
                    <span class="comment-user">{{ c.username || '匿名' }}</span>
                    <span class="comment-time">{{ formatTime(c.createTime) }}</span>
                  </div>
                  <div class="comment-content">{{ c.content }}</div>
                  <div class="comment-footer">
                    <span class="like-count">♥ {{ c.likeCount || 0 }}</span>
                    <el-button v-if="c.userId && c.userId == userId" size="small" type="text" @click="removeComment(c.id)">删除</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="no-comment" v-else>暂无评论，快来发表第一条评论</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getSongDetail, getSongComments, addSongComment, deleteSongComment } from '@/api/song'
import { attachImageUrl } from '@/utils'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

const props = defineProps({
  visible: { type: Boolean, default: false },
  song: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['close'])

const activeTab = ref('lyric')
const detail = ref({})
const comments = ref([])
const newComment = ref('')
const userStore = useUserStore()
const userId = computed(() => userStore.userId)

function getImage(path) { return attachImageUrl(path) }

// 去掉 LRC 时间标签
function stripLrcTags(text) {
  if (!text) return ''
  return text.replace(/\[.*?\]/g, '').trim()
}

const lyricText = computed(() => {
  return stripLrcTags(detail.value.lyric || detail.value.lyrics || '')
})

function formatTime(time) {
  if (!time) return ''
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
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

async function loadDetail() {
  if (!props.song?.id) return
  try {
    const res = await getSongDetail(props.song.id)
    detail.value = res.data.data || {}
  } catch (e) {
    detail.value = {}
  }
}

async function loadComments() {
  if (!props.song?.id) return
  try {
    const res = await getSongComments(props.song.id)
    comments.value = res?.data?.data || []
  } catch (e) {
    comments.value = []
  }
}

async function submitComment() {
  if (!newComment.value || !newComment.value.trim()) {
    ElMessage.error('评论内容不能为空')
    return
  }
  if (!userId.value) {
    ElMessage.error('请先登录')
    return
  }
  try {
    await addSongComment({ targetId: Number(props.song.id), userId: Number(userId.value), content: newComment.value.trim() })
    ElMessage.success('评论已发布')
    newComment.value = ''
    await loadComments()
  } catch (e) {
    ElMessage.error('评论失败')
  }
}

async function removeComment(commentId) {
  if (!userId.value) { ElMessage.error('请先登录'); return }
  try {
    await deleteSongComment(commentId, userId.value)
    ElMessage.success('评论已删除')
    await loadComments()
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

function close() {
  activeTab.value = 'lyric'
  emit('close')
}

watch(() => props.visible, (v) => {
  if (v) {
    loadDetail()
    loadComments()
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.player-detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}
.player-detail-panel {
  position: relative;
  display: flex;
  width: 90vw;
  max-width: 1100px;
  height: 82vh;
  max-height: 750px;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
}
.close-btn {
  position: absolute;
  right: 20px;
  top: 16px;
  z-index: 10;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}
.close-btn:hover { color: #111; }

/* 左侧 */
.left-section {
  width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 32px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  flex-shrink: 0;
}
.big-cover {
  width: 220px;
  height: 220px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  margin-bottom: 24px;
}
.song-name {
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}
.song-artist {
  font-size: 15px;
  color: #aaa;
  text-align: center;
  margin-bottom: 16px;
}
.song-info {
  font-size: 13px;
  color: #999;
  text-align: center;
  line-height: 1.6;
}

/* 右侧 */
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 36px 32px 24px;
  overflow: hidden;
}
.tab-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.tab-buttons button {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  color: #555;
  transition: all 0.2s;
}
.tab-buttons button.active {
  background: #409EFF;
  color: #fff;
  border-color: #409EFF;
}
.tab-buttons button:hover:not(.active) { border-color: #409EFF; color: #409EFF; }

.tab-content {
  flex: 1;
  overflow-y: auto;
}

/* 歌词 */
.lyric-box {
  white-space: pre-wrap;
  line-height: 2;
  color: #333;
  font-size: 15px;
  padding-right: 8px;
}
.no-lyric {
  text-align: center;
  color: #999;
  margin-top: 80px;
  font-size: 14px;
}

/* 评论 */
.comment-panel {
  display: flex;
  flex-direction: column;
}
.comment-form { margin-bottom: 20px; }
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.comment-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 10px;
}
.comment-avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.default-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #409EFF;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
.comment-body { flex: 1; }
.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.comment-user { font-weight: 600; font-size: 14px; color: #333; }
.comment-time { font-size: 12px; color: #999; }
.comment-content { font-size: 14px; color: #444; line-height: 1.6; }
.comment-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}
.like-count { font-size: 12px; color: #cc6666; }
.no-comment {
  text-align: center;
  color: #999;
  margin-top: 60px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .player-detail-panel {
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    max-height: none;
    border-radius: 0;
  }
  .left-section {
    width: 100%;
    padding: 32px 20px;
    flex-shrink: 1;
  }
  .big-cover { width: 140px; height: 140px; margin-bottom: 16px; }
  .right-section { padding: 20px; }
}
</style>
