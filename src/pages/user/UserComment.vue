<template>
  <div class="user-comment">
    <el-empty v-if="comments.length === 0" description="暂无评论" />
    <div v-else class="comment-card" v-for="comment in comments" :key="comment.id">
      <div>
        <h3>{{ comment.title }}</h3>
        <p>{{ comment.content }}</p>
      </div>
      <span class="meta">{{ comment.time }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const comments = ref([
  { id: 1, title: '夜跑路线', content: '这条路线很适合早晨散步。', time: '2025-06-10' },
  { id: 2, title: '音乐角落', content: '期待下次活动。', time: '2025-06-18' }
])
</script>

<style scoped>
.user-comment {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.comment-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #f7f7f7;
  border-radius: 12px;
}
.meta {
  color: #777;
  font-size: 13px;
}
</style>