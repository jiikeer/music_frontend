<template>
  <div class="community-page">
    <div class="page-header">
      <h1>校园社区</h1>
      <p>发现校园音乐人的精彩瞬间</p>
    </div>

    <!-- 瀑布流 -->
    <div class="waterfall" v-loading="loading">
      <div
        class="card"
        v-for="post in posts"
        :key="post.id"
        @click="goDetail(post.id)"
      >
        <!-- 图片 -->
        <div class="card-img-wrap">
          <img :src="post.cover" :alt="post.title" class="card-img" />
        </div>
        <!-- 正文 -->
        <div class="card-body">
          <h3 class="card-title">{{ post.title }}</h3>
          <p class="card-excerpt">{{ post.content }}</p>
          <div class="card-footer">
            <span class="card-time">{{ formatTime(post.createTime) }}</span>
            <span class="card-stats">
              <span class="stat"><el-icon><Star /></el-icon> {{ fmtCount(post.likeCount) }}</span>
              <span class="stat"><el-icon><ChatDotRound /></el-icon> {{ fmtCount(post.commentCount) }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-if="!loading && posts.length === 0" description="暂无帖子，快去发布第一条吧~" />

    <!-- 分页 -->
    <div class="pagination-wrap" v-if="total > pageSize">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="loadPosts"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Star, ChatDotRound } from '@element-plus/icons-vue'
import { getPostPage } from '@/api/post'

const router = useRouter()

const posts = ref([])
const loading = ref(false)
const total = ref(0)
const pageSize = 12
const currentPage = ref(1)

// 模拟帖子数据（后端不可用时展示）
const MOCK_POSTS = [
  { id: 101, title: '🎸 吉他社迎新晚会现场直击', content: '昨晚的迎新晚会太炸了！吉他社的学弟学妹们表现超乎想象，《晴天》全场大合唱直接泪目...', cover: 'https://picsum.photos/seed/guitar1/600/800', createTime: new Date(Date.now() - 3600000).toISOString(), likeCount: 238, commentCount: 56 },
  { id: 102, title: '校园原创歌曲《那年夏天》分享', content: '写了一首关于毕业的歌，Demo 已经录好了，希望大家喜欢~', cover: 'https://picsum.photos/seed/summer2/600/500', createTime: new Date(Date.now() - 7200000).toISOString(), likeCount: 415, commentCount: 102 },
  { id: 103, title: '求助：有人一起组乐队吗？', content: '大二鼓手一枚，想找贝斯、键盘和主唱，风格偏日系摇滚，每周排练两次，有意私聊！', cover: 'https://picsum.photos/seed/band3/600/900', createTime: new Date(Date.now() - 10800000).toISOString(), likeCount: 67, commentCount: 89 },
  { id: 104, title: '🎹 钢琴曲推荐：适合写作业听的轻音乐', content: '整理了 10 首超适合自习时听的钢琴曲，每首都是宝藏，码住慢慢听~', cover: 'https://picsum.photos/seed/piano4/600/650', createTime: new Date(Date.now() - 14400000).toISOString(), likeCount: 521, commentCount: 34 },
  { id: 105, title: '校园歌手大赛报名开启！', content: '一年一度的校园歌手大赛开始报名啦！今年奖金翻倍，冠军 5000 元，快来参加吧~', cover: 'https://picsum.photos/seed/singer5/600/700', createTime: new Date(Date.now() - 18000000).toISOString(), likeCount: 832, commentCount: 201 },
  { id: 106, title: '分享我的打鼓练习日常🥁', content: '练了三个月的双踩终于稳了！附上练习视频片段~', cover: 'https://picsum.photos/seed/drum6/600/550', createTime: new Date(Date.now() - 21600000).toISOString(), likeCount: 156, commentCount: 42 },
  { id: 107, title: '音乐节志愿者招募中', content: '下个月校园音乐节需要 20 名志愿者，主要负责舞台协助和引导，有意向的同学扫码进群！', cover: 'https://picsum.photos/seed/fest7/600/1000', createTime: new Date(Date.now() - 25200000).toISOString(), likeCount: 94, commentCount: 67 },
  { id: 108, title: '尤克里里新手入门指南', content: '从零开始学尤克里里，这篇就够了！包括选购、调音、基础和弦、入门曲谱...', cover: 'https://picsum.photos/seed/uke8/600/600', createTime: new Date(Date.now() - 28800000).toISOString(), likeCount: 678, commentCount: 153 },
  { id: 109, title: '昨晚在操场弹唱被围观了😳', content: '本来只是想自己练练歌，结果围了一圈人，最后变成小型露天演唱会了哈哈', cover: 'https://picsum.photos/seed/field9/600/850', createTime: new Date(Date.now() - 32400000).toISOString(), likeCount: 1203, commentCount: 288 },
  { id: 110, title: '录音棚体验分享🎙️', content: '学校录音棚对外开放了！设备超棒，价格对学生也很友好，推荐大家都去试试~', cover: 'https://picsum.photos/seed/studio10/600/720', createTime: new Date(Date.now() - 36000000).toISOString(), likeCount: 345, commentCount: 78 },
  { id: 111, title: '求推荐适合表白的情歌', content: '暗恋一个女生很久了，想在校园广播站点一首歌表白，大家有什么推荐的歌曲吗？', cover: 'https://picsum.photos/seed/love11/600/580', createTime: new Date(Date.now() - 43200000).toISOString(), likeCount: 267, commentCount: 312 },
  { id: 112, title: '民谣吉他进阶：指弹技巧分享', content: '练了一年指弹，整理了一些实用的练习方法和曲谱，希望能帮到同样喜欢指弹的朋友~', cover: 'https://picsum.photos/seed/finger12/600/780', createTime: new Date(Date.now() - 86400000).toISOString(), likeCount: 445, commentCount: 89 },
]

function fmtCount(n) {
  if (!n) return '0'
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

function formatTime(time) {
  if (!time) return ''
  const d = new Date(time)
  const now = new Date()
  const diffMs = now - d
  const oneMin = 60000
  const oneHour = 3600000
  const oneDay = 86400000
  if (diffMs < oneMin) return '刚刚'
  if (diffMs < oneHour) return Math.floor(diffMs / oneMin) + '分钟前'
  if (diffMs < oneDay) return Math.floor(diffMs / oneHour) + '小时前'
  if (diffMs < 2 * oneDay) return '昨天'
  if (diffMs < 7 * oneDay) return Math.floor(diffMs / oneDay) + '天前'
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function goDetail(id) {
  router.push(`/post/detail/${id}`)
}

async function loadPosts() {
  loading.value = true
  try {
    const res = await getPostPage(currentPage.value, pageSize)
    const result = res?.data
    if (result?.code === 200) {
      const list = Array.isArray(result.data?.records)
        ? result.data.records
        : Array.isArray(result.data)
          ? result.data
          : []
      if (list.length > 0) {
        posts.value = list.map(p => ({
          ...p,
          cover: p.cover || `https://picsum.photos/seed/post${p.id}/600/${500 + Math.floor(Math.random() * 400)}`
        }))
        total.value = result.data?.total || list.length
        loading.value = false
        return
      }
    }
  } catch (e) {
    console.warn('加载帖子失败，使用模拟数据', e)
  }
  // 降级为模拟数据
  posts.value = MOCK_POSTS
  total.value = MOCK_POSTS.length
  loading.value = false
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.community-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 80px;
}

/* ===== 页头 ===== */
.page-header {
  text-align: center;
  padding: 32px 0 24px;
}
.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 6px;
}
.page-header p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

/* ===== 瀑布流容器 ===== */
.waterfall {
  column-count: 4;
  column-gap: 16px;
}

/* ===== 卡片 ===== */
.card {
  break-inside: avoid;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(236, 65, 65, 0.12);
}

/* 图片 */
.card-img-wrap {
  width: 100%;
  overflow: hidden;
  background: #f5f5f7;
}
.card-img {
  width: 100%;
  display: block;
  transition: transform 0.4s ease;
}
.card:hover .card-img {
  transform: scale(1.04);
}

/* 正文 */
.card-body {
  padding: 14px 16px 16px;
}
.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #222;
  margin: 0 0 8px;
  line-height: 1.4;
  /* 两行截断 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-excerpt {
  font-size: 13px;
  color: #777;
  line-height: 1.6;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 底部信息 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #aaa;
}
.card-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}
.stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.stat .el-icon {
  font-size: 14px;
}

/* ===== 分页 ===== */
.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

/* ===== 响应式：列数递减 ===== */
@media (max-width: 1100px) {
  .waterfall { column-count: 3; }
}
@media (max-width: 768px) {
  .waterfall { column-count: 2; column-gap: 10px; }
  .card { margin-bottom: 10px; border-radius: 12px; }
  .card-body { padding: 10px 12px 14px; }
  .card-title { font-size: 14px; }
  .card-excerpt { font-size: 12px; }
  .page-header { padding: 20px 0 16px; }
  .page-header h1 { font-size: 22px; }
}
@media (max-width: 480px) {
  .waterfall { column-count: 1; }
}
</style>
