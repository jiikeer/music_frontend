<template>
  <div class="user-like">
    <el-empty v-if="likedItems.length === 0" description="暂无点赞内容" />
    <div
      v-else
      class="list-card"
      v-for="item in likedItems"
      :key="item.commentId + '_' + item.commentType"
      @click="goSource(item)"
    >
      <div class="like-info">
        <div class="source-tag">
          <el-tag size="small" :type="item.sourceType === 'song' ? '' : 'success'">
            {{ item.sourceType === 'song' ? '歌曲' : '帖子' }}
          </el-tag>
          <span class="source-name">{{ item.sourceName || '未知来源' }}</span>
        </div>
        <p class="comment-content">"{{ item.content }}"</p>
        <div class="comment-meta">
          <span v-if="item.commentUsername">{{ item.commentUsername }}</span>
          <span class="time">{{ formatTime(item.likeTime) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getUserLikedComments } from '@/api/comment'

const router = useRouter()
const userStore = useUserStore()
const likedItems = ref([])

function formatTime(time){
  if(!time) return ''
  const d = new Date(time)
  const pad = (n)=>String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function goSource(item) {
  if (item.sourceType === 'song') {
    router.push(`/song/${item.sourceId}`)
  } else if (item.sourceType === 'post') {
    router.push(`/post/detail/${item.sourceId}`)
  }
}

onMounted(async () => {
  try {
    const userId = userStore.userId
    if (!userId) return
    const res = await getUserLikedComments(userId)
    likedItems.value = res?.data || []
  } catch (e) {
    console.error('加载点赞失败', e)
  }
})
</script>

<style scoped>
.user-like {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.list-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  background: #f7f7f7;
  border-radius: 12px;
  cursor: pointer;
}
.list-card:hover { background: #eee; }
.like-info { flex: 1; min-width: 0; }
.source-tag { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.source-name { font-size: 14px; color: #333; font-weight: 500; }
.comment-content { margin: 0 0 6px; color: #666; font-size: 14px; font-style: italic; }
.comment-meta { display: flex; gap: 12px; font-size: 12px; color: #999; }
</style>
