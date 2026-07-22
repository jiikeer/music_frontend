<template>
  <div class="song-detail">
    <div class="card" v-if="song">
      <div class="back" @click="$router.back()">← 返回</div>
      <h1>{{ song.name }}</h1>
      <img :src="getImage(song.pic || song.cover)" class="cover" />

      <div class="meta">
        <div class="artist">{{ song.introduction || song.artist }}</div>
        <div class="actions">
          <a :href="song.url" :download="song.name" class="download" title="下载歌曲">
            <el-icon><i class="el-icon-download" /></el-icon>
          </a>
        </div>
      </div>

      <audio :src="song.url" controls class="player" />

      <div class="lyrics">
        <div v-if="!showAll">{{ shortLyrics }}</div>
        <div v-else class="full-lyrics">{{ song.lyric }}</div>
        <el-button type="text" @click="showAll = !showAll">{{ showAll ? '收起歌词' : '展开全部歌词' }}</el-button>
      </div>

      <div class="stats">
        <span>收藏：{{ song.collectCount || 0 }}</span>
        <span style="margin-left:16px">评论：{{ song.commentCount || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getSongDetail } from '@/api/song'
import { attachImageUrl } from '@/utils'
 

const route = useRoute()
const song = ref(null)
const showAll = ref(false)

function getImage(path){ return attachImageUrl(path) }

const shortLyrics = computed(()=>{
  if(!song.value || !song.value.lyric) return ''
  const t = song.value.lyric
  return t.length>200 ? t.slice(0,200)+'...' : t
})

async function load(){
  try{
    const res = await getSongDetail(route.params.id)
    song.value = res.data.data
  }catch(e){ song.value = null }
}

onMounted(()=>{ load() })
</script>

<style scoped>
.song-detail{ padding: 24px }
.card{ background:#fff;border-radius:12px;padding:20px;box-shadow:0 6px 20px rgba(0,0,0,0.06) }
.back{ cursor:pointer;color:#666;margin-bottom:12px }
.cover{ width:100%;max-width:560px;height:320px;object-fit:cover;border-radius:8px;margin:12px 0 }
.meta{ display:flex;align-items:center;justify-content:space-between }
.lyrics{ margin-top:16px }
.full-lyrics{ white-space:pre-wrap }
.stats{ margin-top:16px;color:#666 }
</style>
