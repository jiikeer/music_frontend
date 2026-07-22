<template>
  <div class="home-page">
    <section class="carousel-section">
      <el-carousel :interval="4000" trigger="click" type="card" height="360px">
        <el-carousel-item v-for="song in carouselSongs" :key="song.id">
          <div class="carousel-card" @click="goSongDetail(song.id)">
            <img :src="song.cover" alt="cover" class="carousel-image" />
            <div class="carousel-info">
              <div class="carousel-name">{{ song.name }}</div>
              <div class="carousel-artist">{{ song.artist }}</div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <section class="content-grid">
      <div class="panel-song">
        <div class="panel-title">热门歌曲</div>
        <div class="hot-albums">
          <div class="album-card" v-for="song in hotSongs" :key="song.id" @click="goSongDetail(song.id)">
            <div class="cover-wrap">
              <img :src="song.cover" alt="cover" class="cover" />
              <div class="badge-overlay">
                <el-icon><Headset /></el-icon>
                <span>{{ song.playCount }}</span>
              </div>
              <div class="play-icon-overlay">
                <el-icon><VideoPlay /></el-icon>
              </div>
            </div>
            <div class="meta">
              <div class="title">{{ song.name }}</div>
              <div class="artist">{{ song.artist }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">热门帖子</div>
        <div class="list-card" v-for="post in posts" :key="post.id">
          <div>
            <div class="item-title" @click="router.push(`/post/detail/${post.id}`)">{{ post.title }}</div>
            <div class="item-sub">
              <el-icon><Star /></el-icon>
              <span>{{ post.likeCount }}</span>
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ post.commentCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { VideoPlay, Headset, Star, ChatDotRound } from '@element-plus/icons-vue'
import { mockSongs, mockPosts } from '@/data/mockData'

const router = useRouter()
const songs = ref(mockSongs)
const posts = ref(mockPosts)
const hotSongs = computed(() => songs.value.slice(0, 16))
const carouselSongs = computed(() => songs.value.slice(0, 5))

function goSongDetail(id) {
  router.push(`/song/detail/${id}`)
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.carousel-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 20px;
}
.carousel-title {
  font-size: 20px;
  font-weight: 700;
  color: #111;
  padding-bottom: 12px;
  border-bottom: 1.5px solid #444;
}
.carousel-card {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
  border-radius: 16px;
}
.carousel-card:hover .carousel-info {
  opacity: 1;
}
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.carousel-info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.65) 100%);
  color: #fff;
  opacity: 0.95;
}
.carousel-name {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 6px;
}
.carousel-artist {
  font-size: 14px;
  color: #eee;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.24em;
  font-size: 12px;
  color: #aaa;
}
.hero-card h1 {
  margin: 8px 0;
  font-size: 28px;
}
.hero-text {
  color: #ddd;
  margin-bottom: 14px;
}
.hero-actions {
  display: flex;
  gap: 12px;
}
.hero-stats {
  display: flex;
  gap: 18px;
}
.hero-stats > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #333;
  border-radius: 12px;
}
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.panel-song {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 350px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.panel-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid #444;
}
.hot-albums {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}
.album-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.cover-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.play-icon-overlay {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5px;
  height: 5px;
  pointer-events: none;
}
.play-icon-overlay :deep(.el-icon) {
  color: #fff;
  font-size: 18px;
}
.badge-overlay {
  position: absolute;
  left: 5px;
  bottom: 5px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #fff;
}
.badge-overlay :deep(.el-icon) {
  color: #fff;
  font-size: 14px;
}
.badge-overlay span {
  line-height: 1;
}
.meta {
  width: 100%;
}
.title {
  font-size: 16px;
  font-weight: 600;
  color: #111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.artist {
  margin-top: 6px;
  color: #666;
  font-size: 13px;
}
.list-card {
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.list-card:last-child {
  border-bottom: none;
}
.item-title {
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  color: #111;
  transition: color 0.2s ease;
}
.item-title:hover {
  color: #409EFF;
}
.item-sub {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 13px;
}
.item-sub :deep(.el-icon) {
  font-size: 14px;
  color: #999;
}
@media (max-width: 900px) {
  .hero-card, .content-grid {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
  .hero-stats {
    flex-wrap: wrap;
  }
  .hot-albums {
    grid-template-columns: 1fr;
  }
}
</style>