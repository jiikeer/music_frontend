<template>
  <div class="detail-page">
    <div class="detail-card" v-if="post">
      <div class="back" @click="$router.back()">← 返回</div>
      <h1>{{ post.title }}</h1>

      <img v-if="post.cover" :src="getImage(post.cover)" class="cover" />

      <div class="content">{{ post.content }}</div>

      <div class="time">发布时间：{{ formatTime(post.createTime) }}</div>

      <div class="statistics">
        <span class="stat-item">点赞：{{ post.likeCount }}</span>
        <span class="stat-item">评论：{{ post.commentCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPostDetail } from '@/api/post'
import { attachImageUrl } from '@/utils'

const route = useRoute()
const post = ref(null)

function getImage(path){ return attachImageUrl(path) }

function formatTime(time){ if(!time) return ''; return time.replace('T',' ') }

async function load(){
  const id = route.params.id
  try{
    const res = await getPostDetail(id)
    post.value = res.data.data
  }catch(e){ post.value = null }
}

onMounted(()=>{ load() })
</script>

<style scoped>
.detail-page{ padding:40px }
.detail-card{ background:white;border-radius:15px;padding:40px;box-shadow:0 5px 20px rgba(0,0,0,.08) }
.back{ cursor:pointer;color:#666;margin-bottom:20px }
.cover{ width:500px;height:280px;object-fit:cover;border-radius:12px }
.content{ font-size:18px;line-height:2;color:#444;margin-top:16px }
.time{ margin-top:16px;color:#999 }
.statistics{ margin-top:20px; display:flex; gap:20px }
.stat-item{ display:flex; align-items:center; gap:6px }
</style>
