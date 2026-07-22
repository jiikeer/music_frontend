<template>
  <div class="search-page">
    <div class="page-title">搜索结果</div>
    <el-empty v-if="!keyword" description="请输入关键字后搜索" />
    <div v-else class="result-list">
      <div class="result-card" v-for="item in filtered" :key="item.id">
        <div>
          <h3>{{ item.name || item.title }}</h3>
          <p>{{ item.artist || item.content }}</p>
        </div>
        <el-button @click="goDetail(item)">查看</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const songs = ref([])
const posts = ref([])
const keyword = computed(() => route.query.keyword || '')
const filtered = computed(() => {
  const key = String(keyword.value).toLowerCase()
  const matchedSongs = songs.value.filter((item) => item.name?.toLowerCase().includes(key))
  const matchedPosts = posts.value.filter((item) => item.title?.toLowerCase().includes(key))
  return [...matchedSongs, ...matchedPosts]
})

function goDetail(item) {
  if (item.artist) {
    router.push(`/song/detail/${item.id}`)
  } else {
    router.push(`/post/detail/${item.id}`)
  }
}
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.page-title {
  font-size: 24px;
  font-weight: 700;
}
.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.result-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}
</style>