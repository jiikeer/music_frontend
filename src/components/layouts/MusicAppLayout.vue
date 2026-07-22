<template>
  <div class="app-shell">
    <header class="musicHeader">
      <MusicHeader />
    </header>
    <main class="app-main">
      <router-view />
    </main>
    <footer class="player-bar" v-if="currentSong">
      <div class="player-info">
        <img :src="currentSong.cover" alt="cover" class="player-cover" @click="goSongDetail" style="cursor:pointer;" />
        <div>
          <div class="player-name">{{ currentSong.name }}</div>
          <div class="player-artist">{{ currentSong.artist }}</div>
        </div>
      </div>
      <audio :src="currentSong.url" controls autoplay class="player-audio" />
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MusicHeader from './MusicHeader.vue'
import { mockSongs } from '@/data/mockData'

const currentSong = ref(mockSongs[0])
const router = useRouter()

function goSongDetail(){
  if(currentSong.value && currentSong.value.id){
    router.push(`/song/detail/${currentSong.value.id}`)
  }
}

window.addEventListener('play-song', (event) => {
  const song = event.detail
  if (song) {
    currentSong.value = song
  }
})
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f7f7 0%, #ececec 100%);
  color: #111;
}
.musicHeader {
  position: sticky;
  top: 0;
  z-index: 20;
}
.app-main {
  padding: 24px;
  padding-bottom: 100px;
}
.player-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 24px;
  background: rgba(17, 17, 17, 0.95);
  color: #fff;
  border-top: 1px solid #333;
}
.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.player-cover {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}
.player-name {
  font-weight: 600;
}
.player-artist {
  font-size: 12px;
  color: #bbb;
}
.player-audio {
  width:80%
}
@media (max-width: 768px) {
  .app-main {
    padding: 16px;
    padding-bottom: 140px;
  }
  .player-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  .player-audio {
    width: 100%;
  }
}
</style>