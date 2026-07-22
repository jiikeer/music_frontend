<template>
  <div class="app-shell">
    <header class="musicHeader">
      <MusicHeader />
    </header>
    <main class="app-main">
      <router-view />
    </main>
    <footer class="player-bar">
      <template v-if="currentSong">
        <div class="player-info">
          <img :src="currentSong.cover" alt="cover" class="player-cover" @click="showPlayerDetail = true" style="cursor:pointer;" />
          <div>
            <div class="player-name">{{ currentSong.name }}</div>
            <div class="player-artist">{{ currentSong.artist }}</div>
          </div>
        </div>
        <audio :src="currentSong.url" controls autoplay class="player-audio" />
      </template>
      <div v-else class="player-empty">当前没有播放歌曲</div>
    </footer>

    <PlayerDetail
      :visible="showPlayerDetail"
      :song="currentSong || {}"
      @close="showPlayerDetail = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MusicHeader from './MusicHeader.vue'
import PlayerDetail from '@/components/PlayerDetail.vue'

const currentSong = ref(null)
const showPlayerDetail = ref(false)

window.addEventListener('play-song', (event) => {
  const song = event.detail
  if (song) {
    currentSong.value = song
  } else {
    // detail 为 null 表示暂停，清空当前歌曲
    currentSong.value = null
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
  padding: 24px 0;
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
.player-empty {
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 14px;
}
@media (max-width: 768px) {
  .app-main {
    padding: 16px 0;
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