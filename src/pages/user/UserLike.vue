<template>
  <div class="user-like">
    <el-empty v-if="likedPosts.length === 0" description="暂无点赞内容" />
    <div v-else class="list-card" v-for="post in likedPosts" :key="post.id" @click="router.push(`/post/detail/${post.id}`)">
      <img v-if="post.cover" :src="attachImageUrl(post.cover)" class="post-cover" />
      <div class="post-text">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content?.slice(0, 80) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getUserPosts } from '@/api/post'
import { attachImageUrl } from '@/utils'

const router = useRouter()
const userStore = useUserStore()
const likedPosts = ref([])

onMounted(async () => {
  try {
    const userId = userStore.userId
    if (!userId) return
    const res = await getUserPosts(userId)
    // api() 已剥离 axios response，拿到 {code, data}
    const list = res?.data || []
    // 筛选用户点赞过的帖子 (likeCount > 0 且有被点赞记录的)
    // 目前项目没有"获取用户点赞帖子"的独立接口，暂时显示用户自己的帖子作为兜底
    // TODO: 等后端加 GET /post/user/liked 接口后替换
    likedPosts.value = Array.isArray(list) ? list : []
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
  align-items: center;
  padding: 14px 16px;
  background: #f7f7f7;
  border-radius: 12px;
  cursor: pointer;
}
.list-card:hover { background: #eee; }
.post-cover {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}
.post-text { flex: 1; min-width: 0; }
.post-text h3 { margin: 0 0 6px; font-size: 16px; }
.post-text p { margin: 0; color: #777; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>