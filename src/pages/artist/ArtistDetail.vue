<template>
  <div class="artist-page">
    <div v-if="artist" class="artist-card">
      <img :src="getImage(artist.pic)" class="artist-pic" />
      <div class="artist-info">
        <h1 class="artist-name">{{ artist.name }}</h1>
        <p class="artist-intro">{{ artist.introduction }}</p>
        <div class="artist-meta">
          <span>共 {{ songs.length }} 首歌曲</span>
        </div>
      </div>
    </div>

    <div class="songs-section">
      <h2>全部作品</h2>
      <div class="song-list" v-if="songs.length">
        <div class="song-item" v-for="s in songs" :key="s.id" @click="playSong(s)">
          <img :src="getImage(s.pic)" class="song-cover" />
          <div class="song-info">
            <div class="song-name">{{ s.name }}</div>
            <div class="song-meta">
              <span>▶ {{ s.playCount || 0 }}</span>
            </div>
          </div>
          <el-button size="small" @click.stop="$router.push(`/song/detail/${s.id}`)">详情</el-button>
        </div>
      </div>
      <el-empty v-else description="该歌手暂无作品" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getSingerDetail, getSingerSongs } from '@/api/singer'
import { attachImageUrl } from '@/utils'

const route = useRoute()
const artist = ref(null)
const songs = ref([])

function getImage(path) { return attachImageUrl(path) }

function playSong(s) {
  const artistName = artist.value?.name || ''
  window.dispatchEvent(new CustomEvent('play-song', { detail: {
    id: s.id,
    name: s.name,
    artist: s.singerName || artistName,
    cover: getImage(s.pic),
    url: s.url?.includes('://') ? s.url : attachImageUrl(s.url)
  }}))
}

async function load() {
  const id = route.params.id
  try {
    const [aRes, sRes] = await Promise.all([
      getSingerDetail(id),
      getSingerSongs(id)
    ])
    const aData = aRes?.data
    artist.value = aData?.data || aData || {}
    const sData = sRes?.data
    songs.value = Array.isArray(sData) ? sData : (sData?.data || [])
  } catch (e) {
    artist.value = null
    songs.value = []
  }
}

onMounted(load)
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
.artist-pic { width: 180px; height: 180px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
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
</style>
