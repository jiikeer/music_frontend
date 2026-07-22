<template>
  <div class="user-like">
    <el-empty v-if="likedPosts.length === 0" description="暂无点赞内容" />
    <div v-else class="list-card" v-for="post in likedPosts" :key="post.id">
      <div>
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
      </div>
      <el-button @click="router.push(`/post/detail/${post.id}`)">查看</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mockPosts } from '@/data/mockData'

const router = useRouter()
const likedPosts = ref(mockPosts.slice(0, 2))
</script>

<style scoped>
.user-like {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.list-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #f7f7f7;
  border-radius: 12px;
}
</style>