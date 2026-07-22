<template>
  <div class="song-list-page">
  <section class="section-block">
    <div class="section-header">热门新碟</div>
    <div class="album-grid">
      <div
        class="album-item"
        v-for="song in hotSongs"
        :key="song.id"
        @click="playSong(song)"
        title="点击播放"
      >
        <div class="cover-wrap">
          <img :src="song.cover" alt="cover" class="cover" />
          <div class="hover-overlay">
            <el-icon><VideoPlay /></el-icon>
          </div>
        </div>
        <div class="meta">
          <div class="title">{{ song.name }}</div>
          <div class="artist">{{ song.artist }}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section-block">
    <div class="section-header">全部新碟</div>
    <div class="album-grid">
      <div
        class="album-item"
        v-for="song in pagedSongs"
        :key="song.id"
        @click="playSong(song)"
        title="点击播放"
      >
        <div class="cover-wrap">
          <img :src="song.cover" alt="cover" class="cover" />
          <div class="hover-overlay">
            <el-icon><VideoPlay /></el-icon>
          </div>
        </div>
        <div class="meta">
          <div class="title">{{ song.name }}</div>
          <div class="artist">{{ song.artist }}</div>
        </div>
      </div>
    </div>

    <div class="pagination-wrap">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="songs.length"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>
  </section>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { VideoPlay } from '@element-plus/icons-vue'
import { mockSongs } from '@/data/mockData'

const songs = ref(mockSongs)
const pageSize = 35
const currentPage = ref(1)

const hotSongs = computed(() => songs.value.filter((song) => song.status === 1).slice(0, 10))
const pagedSongs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return songs.value.slice(start, start + pageSize)
})

function playSong(song) {
  // 通知全局播放器播放此曲
  window.dispatchEvent(new CustomEvent('play-song', { detail: song }))
}

function handlePageChange(page) {
  currentPage.value = page
}
</script>

<style scoped>
.song-list-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0 200px;
}
.page-title {
  font-size: 26px;
  font-weight: 700;
}
.album-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
}
.album-item {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
}
.cover-wrap {
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  transform: none;
}
.hover-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  border-radius: 8px;
  background: transparent;
  transition: opacity 0.2s ease;
}
.album-item:hover .hover-overlay {
  opacity: 1;
}
.hover-overlay :deep(.el-icon) {
  color: #fff;
  font-size: 30px;
}
.meta {
  margin-top: 12px;
  text-align: left;
  width: 220px;
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
.section-block {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  gap: 16px;
}
.section-header {
  font-size: 20px;
  font-weight: 700;
  color: #111;
  padding-bottom: 10px;
  border-bottom: 2px solid #000;
}
.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

@media (max-width: 1400px) {
  .album-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 1100px) {
  .album-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .cover-wrap, .meta { width: 150px; }
  .cover { width: 130px; height: 130px; transform: translateX(-5px); }
}

@media (max-width: 900px) {
  .album-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .cover-wrap, .meta { width: 140px; }
  .cover { width: 120px; height: 120px; transform: translateX(-4px); }
}

@media (max-width: 700px) {
  .album-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .cover-wrap, .meta { width: 180px; }
  .cover { width: 150px; height: 150px; transform: translateX(-4px); }
}

</style>