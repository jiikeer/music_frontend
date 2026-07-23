<template>
  <div class="app-shell">
    <header class="musicHeader">
      <MusicHeader />
    </header>
    <main class="app-main">
      <router-view />
    </main>

    <!-- 有歌曲时 -->
    <footer class="player-bar" v-if="currentSong">
      <div class="player-inner">
        <div class="player-left">
          <img :src="currentSong.cover" class="player-cover" @click="showPlayerDetail = true" />
          <div class="player-info">
            <div class="player-name">{{ currentSong.name }}</div>
            <div class="player-artist">
              <span v-if="currentSong.singerUserId" class="artist-link" @click="$router.push('/user-page/' + currentSong.singerUserId)">{{ currentSong.artist }}</span>
              <span v-else>{{ currentSong.artist }}</span>
            </div>
          </div>
        </div>

        <div class="player-center">
          <div class="player-controls">
            <el-button circle :icon="ArrowLeft" size="small" text :disabled="!queue.hasPrev" @click="prevSong" />
            <el-button circle :icon="playing ? VideoPause : VideoPlay" size="large" type="primary" class="play-btn" @click="togglePlay" />
            <el-button circle :icon="ArrowRight" size="small" text :disabled="!queue.hasNext" @click="nextSong" />
          </div>
          <div class="player-progress">
            <span class="time">{{ playedTime }}</span>
            <div class="progress-bar" @click="seekAudio">
              <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            </div>
            <span class="time">{{ duration }}</span>
          </div>
        </div>

        <div class="player-right">
          <div class="volume-wrap">
            <el-button circle size="small" text @click="toggleMute">
              <el-icon v-if="isMuted || volume === 0"><VideoOff /></el-icon>
              <el-icon v-else><VideoPlay /></el-icon>
            </el-button>
            <el-slider v-model="volume" :max="100" size="small" class="volume-slider" @input="setVolume" />
          </div>
          <el-button circle size="small" text @click="showQueueDrawer = true">
            <el-icon><List /></el-icon>
          </el-button>
        </div>
      </div>
      <audio ref="audioRef" :src="currentSong.url" autoplay @timeupdate="onTimeUpdate" @loadedmetadata="onLoaded" @play="playing = true" @pause="playing = false" @ended="onSongEnded" />
    </footer>

    <!-- 无歌曲时占位 -->
    <footer v-else class="player-bar player-empty-bar">
      <div class="player-inner">
        <span style="color:#999;font-size:13px;">选择一首歌曲开始播放</span>
      </div>
    </footer>

    <PlayerDetail :visible="showPlayerDetail" :song="currentSong || {}" @close="showPlayerDetail = false" />

    <!-- 播放队列抽屉 -->
    <el-drawer title="播放队列" v-model="showQueueDrawer" direction="rtl" size="380px">
      <div class="queue-list" v-if="queue.queue.length">
        <div v-for="(s, idx) in queue.queue" :key="idx" :class="['queue-item', { 'queue-current': idx === queue.currentIndex }]" @click="playQueueIndex(idx)">
          <span class="queue-idx">{{ idx + 1 }}</span>
          <img :src="s.cover" class="queue-cov" />
          <div class="queue-inf">
            <div class="queue-nm">{{ s.name }}</div>
            <div class="queue-ar">{{ s.artist }}</div>
          </div>
          <el-icon v-if="idx === queue.currentIndex" color="#ec4141"><VideoPlay /></el-icon>
          <el-button circle size="small" text @click.stop="removeQueueItem(idx)">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </div>
      <el-empty v-else description="播放队列为空" />
      <div class="queue-footer" v-if="queue.queue.length">
        <el-button type="danger" text size="small" @click="clearQueue">清空列表</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'
import MusicHeader from './MusicHeader.vue'
import PlayerDetail from '@/components/PlayerDetail.vue'
import { ArrowLeft, ArrowRight, VideoPause, VideoPlay, List, Close, VideoOff } from '@element-plus/icons-vue'
import { usePlayQueue } from '@/store/playQueue'

const queue = usePlayQueue()
const currentSong = ref(null)
const showPlayerDetail = ref(false)
const showQueueDrawer = ref(false)
const playing = ref(false)
const playedTime = ref('0:00')
const duration = ref('0:00')
const progress = ref(0)
const volume = ref(80)
const isMuted = ref(false)
const prevVolume = ref(80)
const audioRef = ref(null)

function togglePlay() {
  if (!audioRef.value) return
  if (playing.value) audioRef.value.pause()
  else audioRef.value.play()
}

function onTimeUpdate() {
  onTimeUpdateTick()
  if (!audioRef.value) return
  const el = audioRef.value
  progress.value = Math.min(100, (el.currentTime / (el.duration || 1)) * 100)
  const m = Math.floor(el.currentTime / 60)
  playedTime.value = m + ':' + String(Math.floor(el.currentTime % 60)).padStart(2, '0')
}

function onLoaded() {
  if (!audioRef.value) return
  const m = Math.floor(audioRef.value.duration / 60)
  duration.value = m + ':' + String(Math.floor(audioRef.value.duration % 60)).padStart(2, '0')
}

function seekAudio(e) {
  if (!audioRef.value) return
  const rect = e.target.getBoundingClientRect()
  audioRef.value.currentTime = ((e.clientX - rect.left) / rect.width) * audioRef.value.duration
}

function prevSong() { queue.prev() }
function nextSong() { queue.next() }

function onSongEnded() {
  if (queue.hasNext) setTimeout(() => queue.next(), 500)
}

function setVolume(val) {
  if (audioRef.value) audioRef.value.volume = val / 100
  if (val > 0) isMuted.value = false
}

function toggleMute() {
  if (isMuted.value) {
    volume.value = prevVolume.value
    setVolume(prevVolume.value)
    isMuted.value = false
  } else {
    prevVolume.value = volume.value
    volume.value = 0
    setVolume(0)
    isMuted.value = true
  }
}

function addToQueue(song) {
  if (!song || !song.id) return
  const exists = queue.queue.find(q => q.id === song.id)
  if (exists) {
    ElMessage.warning('该歌曲已在播放列表中')
    return
  }
  queue.queue.push(song)
  ElMessage.success('已加入播放列表')
}

function playQueueIndex(idx) {
  queue.playIndex(idx)
  showQueueDrawer.value = false
}

function removeQueueItem(idx) {
  if (queue.queue.length === 1) {
    clearQueue()
    return
  }
  queue.removeFromQueue(idx)
}

function clearQueue() { queue.clear(); showQueueDrawer.value = false }

// 30秒判定：播放达30秒后调用后端播放量+1
let playCounted = false
function onTimeUpdateTick() {
  if (!audioRef.value || playCounted) return
  if (audioRef.value.currentTime >= 30) {
    playCounted = true
    const song = currentSong.value
    if (song && song.id) {
      request.post('/song/' + song.id + '/play').catch(() => {})
    }
  }
}

function resetPlayCount() {
  playCounted = false
}

watch(() => currentSong.value, () => {
  resetPlayCount()
}, { deep: false })

watch(() => queue.currentSong, (song) => {
  if (song) {
    currentSong.value = song
    setTimeout(() => { if (audioRef.value) audioRef.value.play().catch(() => {}) }, 100)
  } else {
    currentSong.value = null
    playing.value = false
  }
}, { immediate: true })

window.addEventListener('play-song', (event) => {
  const song = event.detail
  if (song) {
    currentSong.value = song
  } else {
    currentSong.value = null
    playing.value = false
  }
})
</script>

<style scoped>
.app-shell { min-height: 100vh; background: #f5f5f7; color: #111; }
.musicHeader { position: fixed; top: 0; left: 0; right: 0; z-index: 999; }
.app-main { min-height: calc(100vh - 60px); padding-bottom: 80px; }

.player-bar {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 999;
  background: #fff; border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04); height: 64px;
}
.player-empty-bar .player-inner { justify-content: center; }

.player-inner {
  max-width: 1200px; margin: 0 auto; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px; gap: 16px;
}

.player-left { display: flex; align-items: center; gap: 12px; width: 220px; flex-shrink: 0; }
.player-cover { width: 44px; height: 44px; border-radius: 6px; object-fit: cover; cursor: pointer; }
.player-info { min-width: 0; }
.player-name { font-size: 14px; font-weight: 600; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.player-artist { font-size: 12px; color: #999; margin-top: 2px; }
.artist-link { color: #ec4141; cursor: pointer; }
.artist-link:hover { text-decoration: underline; }

.player-center { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; max-width: 500px; }
.player-controls { display: flex; align-items: center; gap: 8px; }
.play-btn { --el-button-bg-color: #ec4141; --el-button-border-color: #ec4141; }
.play-btn:hover { --el-button-bg-color: #d93939; --el-button-border-color: #d93939; }

.player-progress { display: flex; align-items: center; gap: 10px; width: 100%; }
.time { font-size: 11px; color: #999; min-width: 32px; text-align: center; }
.progress-bar { flex: 1; height: 4px; background: #eee; border-radius: 2px; cursor: pointer; position: relative; }
.progress-bar:hover { height: 6px; }
.progress-fill { height: 100%; background: #ec4141; border-radius: 2px; transition: width 0.2s linear; }

.player-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.volume-wrap { display: flex; align-items: center; gap: 4px; }
.volume-slider { width: 80px; }

.queue-list { padding: 8px 0; max-height: calc(100vh - 140px); overflow-y: auto; }
.queue-item { display: flex; align-items: center; gap: 12px; padding: 10px 16px; cursor: pointer; border-radius: 8px; transition: background 0.2s; }
.queue-item:hover { background: #f5f5f7; }
.queue-current { background: #fff3f3; }
.queue-idx { width: 24px; text-align: center; font-size: 13px; color: #999; flex-shrink: 0; }
.queue-current .queue-idx { color: #ec4141; font-weight: 700; }
.queue-cov { width: 40px; height: 40px; border-radius: 6px; object-fit: cover; flex-shrink: 0; }
.queue-inf { flex: 1; min-width: 0; }
.queue-nm { font-size: 14px; color: #333; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.queue-current .queue-nm { color: #ec4141; }
.queue-ar { font-size: 12px; color: #999; margin-top: 2px; }
.queue-footer { padding: 12px 16px; border-top: 1px solid #f0f0f0; display: flex; justify-content: flex-end; }

@media (max-width: 768px) {
  .player-left { width: auto; }
  .player-center { max-width: none; }
  .volume-wrap { display: none; }
}
</style>