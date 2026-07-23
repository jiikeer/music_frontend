<template>
  <div class="home-page">
    <!-- Banner -->
    <section class="banner-section">
      <el-carousel :interval="3000" trigger="click" height="320px" indicator-position="none" arrow="always">
        <el-carousel-item v-for="(item, idx) in banners" :key="idx">
          <div class="banner-card" :style="{ backgroundImage: 'url(' + item.bg + ')' }" @click="goLink(item.link)">
            <div class="banner-mask"></div>
            <div class="banner-text"><h2>{{ item.title }}</h2><p>{{ item.subtitle }}</p></div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- 快捷入口 -->
    <section class="quick-section">
      <div class="quick-grid">
        <div v-for="item in quickEntries" :key="item.label" class="quick-item" @click="$router.push(item.path)">
          <div class="quick-icon" :style="{ background: item.bg }"><el-icon :size="24"><component :is="item.icon" /></el-icon></div>
          <span class="quick-label">{{ item.label }}</span>
        </div>
      </div>
    </section>

    <!-- 双栏歌曲榜单 -->
    <section class="section-block">
      <div class="rank-grid">
        <div class="rank-panel">
          <div class="section-header"><h2>新歌速递</h2></div>
          <div class="rank-list">
            <div v-for="(s, idx) in newSongs" :key="s.id" class="rank-item" @click="playSong(s)">
              <span class="rank-idx index-normal">{{ idx + 1 }}</span>
              <img :src="getImg(s.pic)" class="rank-cover" />
              <div class="rank-info">
                <div class="rank-name">{{ s.name }}</div>
                <div class="rank-artist">
                  <span v-if="s.singerUserId" class="link-artist" @click.stop="$router.push('/user-page/' + s.singerUserId)">{{ s.singer || s.singerName || '未知' }}</span>
                  <span v-else>{{ s.singer || s.singerName || s.introduction || '未知' }}</span>
                </div>
              </div>
              <el-button size="small" text @click.stop="addToList(s)">加入列表</el-button>
              <el-button size="small" text @click.stop="$router.push('/song/detail/' + s.id)">详情</el-button>
            </div>
          </div>
        </div>
        <div class="rank-panel">
          <div class="section-header"><h2>热门歌曲榜</h2></div>
          <div class="rank-list">
            <div v-for="(s, idx) in hotRankSongs" :key="s.id" class="rank-item" @click="playSong(s)">
              <span :class="['rank-idx', idx < 3 ? 'idx-top' : 'idx-norm']">{{ idx + 1 }}</span>
              <img :src="getImg(s.pic)" class="rank-cover" />
              <div class="rank-info">
                <div class="rank-name">{{ s.name }}</div>
                <div class="rank-artist">
                  <span v-if="s.singerUserId" class="link-artist" @click.stop="$router.push('/user-page/' + s.singerUserId)">{{ s.singer || s.singerName || '未知' }}</span>
                  <span v-else>{{ s.singer || s.singerName || s.introduction || '未知' }}</span>
                  <span class="rank-extra">▶ {{ fmtCount(s.playCount) }}</span>
                </div>
              </div>
              <el-button size="small" text @click.stop="addToList(s)">加入列表</el-button>
              <el-button size="small" text @click.stop="$router.push('/song/detail/' + s.id)">详情</el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门社区动态 -->
    <section class="section-block">
      <div class="section-header"><h2>音乐社区热门</h2></div>
      <div class="post-grid">
        <div v-for="p in posts" :key="p.id" class="post-card" @click="$router.push('/post/detail/' + p.id)">
          <div class="post-top">
            <img :src="getImg(p.avatar)" class="post-avatar" />
            <span class="post-author">{{ p.username || '匿名' }}</span>
          </div>
          <img v-if="p.cover" :src="getImg(p.cover)" class="post-cover" />
          <div class="post-title">{{ p.title }}</div>
          <div class="post-stats">
            <span><el-icon><Star /></el-icon> {{ p.likeCount || 0 }}</span>
            <span><el-icon><ChatDotRound /></el-icon> {{ p.commentCount || 0 }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Headset, UserFilled, ChatDotRound, Upload, Star } from '@element-plus/icons-vue'
import { getHotSongList } from '@/api/song'
import { getPostPage } from '@/api/post'
import { attachImageUrl } from '@/utils'
import { usePlayQueue } from '@/store/playQueue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const queue = usePlayQueue()
const allSongs = ref([])
const posts = ref([])

const banners = [
  { title: '校园原创音乐征集', subtitle: '用你的声音，唱出青春的模样', bg: 'https://picsum.photos/seed/m1/1200/320', link: '/upload' },
  { title: '周杰伦 — 晴天', subtitle: '故事的小黄花，从出生那年就飘着', bg: 'https://picsum.photos/seed/m2/1200/320', link: '/song-list' },
  { title: '五月天 — 倔强', subtitle: '我和我最后的倔强，握紧双手绝对不放', bg: 'https://picsum.photos/seed/m3/1200/320', link: '/song-list' },
  { title: '音乐社区火热上线', subtitle: '来分享你的音乐故事，遇见志同道合的朋友', bg: 'https://picsum.photos/seed/m4/1200/320', link: '/community' }
]

const quickEntries = [
  { label: '歌曲', icon: Headset, bg: '#ffa502', path: '/song-list' },
  { label: '原创歌手', icon: UserFilled, bg: '#5352ed', path: '/singer' },
  { label: '音乐社区', icon: ChatDotRound, bg: '#1e90ff', path: '/community' },
  { label: '我要上传', icon: Upload, bg: '#ec4141', path: '/upload' }
]

const newSongs = computed(() => allSongs.value.filter(s => s.status === 1).sort((a, b) => new Date(b.createTime) - new Date(a.createTime)).slice(0, 8))
const hotRankSongs = computed(() => allSongs.value.filter(s => s.status === 1).sort((a, b) => (b.playCount || 0) - (a.playCount || 0)).slice(0, 10))

function getImg(p) { return attachImageUrl(p) }
function goLink(p) { if (p) router.push(p) }
function fmtCount(n) { if (!n) return '0'; if (n >= 10000) return (n / 10000).toFixed(1) + '万'; return String(n) }

function playSong(s) {
  queue.playSong({
    id: s.id, name: s.name,
    artist: s.singer || s.singerName || s.introduction || '未知',
    cover: getImg(s.pic), singerUserId: s.singerUserId,
    url: s.url && s.url.includes('://') ? s.url : attachImageUrl(s.url)
  })
}

function addToList(s) {
  const item = {
    id: s.id, name: s.name,
    artist: s.singer || s.singerName || s.introduction || '未知',
    cover: getImg(s.pic), singerUserId: s.singerUserId,
    url: s.url && s.url.includes('://') ? s.url : attachImageUrl(s.url)
  }
  if (queue.queue.find(q => q.id === item.id)) { ElMessage.warning('该歌曲已在播放列表中'); return }
  queue.queue.push(item)
  ElMessage.success('已加入播放列表')
}

async function loadSongs() {
  try {
    const res = await getHotSongList(50)
    const data = res?.data?.data || res?.data || []
    allSongs.value = Array.isArray(data) ? data : []
  } catch (e) { console.error(e) }
}

async function loadPosts() {
  try {
    const res = await getPostPage(1, 6)
    const d = res?.data
    const list = d?.data?.records || d?.records || (Array.isArray(d) ? d : [])
    posts.value = list.slice(0, 3)
  } catch (e) { console.error(e) }
}

onMounted(() => { loadSongs(); loadPosts() })
</script>

<style scoped>
.home-page { max-width: 1200px; margin: 80px auto 0; padding: 0 16px 100px; display: flex; flex-direction: column; gap: 24px; }

.banner-section :deep(.el-carousel__arrow) { background: rgba(255,255,255,0.8); color: #333; width: 36px; height: 36px; border-radius: 50%; }
.banner-section :deep(.el-carousel__container) { border-radius: 12px; overflow: hidden; }
.banner-card { width: 100%; height: 100%; background-size: cover; background-position: center; cursor: pointer; border-radius: 12px; overflow: hidden; position: relative; }
.banner-mask { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.5) 100%); }
.banner-text { position: absolute; left: 40px; bottom: 40px; color: #fff; }
.banner-text h2 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
.banner-text p { font-size: 15px; opacity: 0.85; }

.quick-section { margin-top: 4px; }
.quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.quick-item { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 16px 8px; cursor: pointer; border-radius: 12px; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.06); transition: transform 0.3s, box-shadow 0.3s; }
.quick-item:hover { transform: translateY(-4px); box-shadow: 0 6px 20px rgba(0,0,0,0.10); }
.quick-item:hover .quick-label { color: #ec4141; }
.quick-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; transition: transform 0.3s; }
.quick-item:hover .quick-icon { transform: scale(1.1); }
.quick-label { font-size: 13px; color: #333; font-weight: 500; transition: color 0.3s; }

.section-block { background: #fff; border-radius: 12px; padding: 20px 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.section-header h2 { font-size: 20px; font-weight: 700; color: #333; }
.section-more { font-size: 13px; color: #999; cursor: pointer; }
.section-more:hover { color: #ec4141; }

.rank-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.rank-list { display: flex; flex-direction: column; }
.rank-item { display: flex; align-items: center; gap: 12px; padding: 8px 4px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
.rank-item:hover { background: #f5f5f7; }
.rank-idx { width: 24px; text-align: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
.idx-top { color: #ec4141; font-size: 20px; }
.idx-norm { color: #999; }
.rank-cover { width: 44px; height: 44px; border-radius: 6px; object-fit: cover; flex-shrink: 0; }
.rank-info { flex: 1; min-width: 0; }
.rank-name { font-size: 14px; font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rank-artist { font-size: 12px; color: #999; margin-top: 2px; }
.link-artist { color: #ec4141; cursor: pointer; }
.link-artist:hover { text-decoration: underline; }
.rank-extra { margin-left: 6px; }

.post-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.post-card { cursor: pointer; border-radius: 8px; background: #fafafa; padding: 14px; transition: transform 0.3s, box-shadow 0.3s; }
.post-card:hover { transform: translateY(-4px); box-shadow: 0 6px 20px rgba(0,0,0,0.10); }
.post-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.post-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.post-author { font-size: 13px; color: #666; font-weight: 500; }
.post-cover { width: 100%; height: 140px; object-fit: cover; display: block; border-radius: 6px; margin-bottom: 10px; }
.post-title { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.post-stats { display: flex; gap: 16px; font-size: 12px; color: #999; }
.post-stats span { display: flex; align-items: center; gap: 4px; }

@media (max-width: 900px) {
  .quick-grid { grid-template-columns: repeat(2, 1fr); }
  .rank-grid { grid-template-columns: 1fr; }
  .post-grid { grid-template-columns: 1fr; }
}
</style>