<template>
  <div class="community-page">
    <section class="panel">
      <div class="panel-title">最新帖子</div>
      <div class="post-card" v-for="post in posts" :key="post.id">
        <div class="post-content">
          <h3 class="post-title" @click="router.push(`/post/detail/${post.id}`)">{{ post.title }}</h3>
          <p>{{ post.content }}</p>
          <div class="post-time">{{ formatTime(post.createTime) }}</div>
          <div class="post-meta">
            <el-icon><Star /></el-icon>
            <span>{{ post.likeCount }}</span>
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ post.commentCount }}</span>
          </div>
        </div>
      </div>
    </section>
    <section class="panel">
      <div class="panel-title">热门帖子</div>
      <div class="post-card" v-for="post in posts" :key="post.id">
        <div class="post-content">
          <h3 class="post-title" @click="router.push(`/post/detail/${post.id}`)">{{ post.title }}</h3>
          <p>{{ post.content }}</p>
          <div class="post-meta">
            <el-icon><Star /></el-icon>
            <span>{{ post.likeCount }}</span>
            <el-icon><ChatDotRound /></el-icon>
            <span>{{ post.commentCount }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Star, ChatDotRound } from '@element-plus/icons-vue'
import { mockPosts } from '@/data/mockData'

const router = useRouter()
const posts = ref(mockPosts)

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
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
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}
</script>

<style scoped>
.community-page {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 20px;
}
.panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.panel-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1.5px solid #444;
}
.post-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.post-card h3 {
  margin: 0 0 4px;
}
.post-title {
  cursor: pointer;
  color: #111;
  transition: color 0.2s ease;
}
.post-title:hover {
  color: #409EFF;
}
.post-card p {
  margin: 0;
  color: #777;
}
.post-time {
  margin-top: 6px;
  margin-bottom: 6px;
  color: #999;
  font-size: 12px;
}
.post-meta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #666;
}
.post-meta :deep(.el-icon) {
  font-size: 16px;
  color: #999;
}
.post-meta span {
  margin-right: 12px;
}
@media (max-width: 900px) {
  .community-page {
    grid-template-columns: 1fr;
  }
}
</style>