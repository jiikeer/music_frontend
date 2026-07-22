<template>
  <div class="search-page">
    <div class="page-title">搜索结果</div>
    <el-empty v-if="!keyword" description="请输入关键字后搜索" />
    <el-empty v-else-if="keyword && filtered.length === 0" :description="'未找到与「' + keyword + '」相关的结果'" />
    <div v-else class="result-list">
      <div class="result-card" v-for="item in filtered" :key="item.id">
        <div class="card-left">
          <el-tag size="small" :type="item.url !== undefined ? 'primary' : 'success'" class="result-tag">
            {{ item.url !== undefined ? '歌曲' : '帖子' }}
          </el-tag>
          <div>
            <h3>{{ item.name || item.title }}</h3>
            <p>{{ item.introduction || item.content?.slice(0, 100) }}</p>
          </div>
        </div>
        <el-button @click="goDetail(item)">查看</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHotSongList } from '@/api/song'
import { getPostPage } from '@/api/post'

const route = useRoute()
const router = useRouter()
const songs = ref([])
const posts = ref([])
const keyword = computed(() => route.query.keyword || '')

const filtered = computed(() => {
  const key = String(keyword.value).toLowerCase()
  if (!key) return []
  const matchedSongs = songs.value.filter((item) => item.name?.toLowerCase().includes(key))
  const matchedPosts = posts.value.filter((item) => item.title?.toLowerCase().includes(key))
  return [...matchedSongs, ...matchedPosts]
})

watch(keyword, () => {
  if (keyword.value) loadData()
}, { immediate: true })

async function loadData() {
  try {
    const [songRes, postRes] = await Promise.all([
      getHotSongList(100),
      getPostPage(1, 100)
    ])
    songs.value = Array.isArray(songRes.data?.data) ? songRes.data.data : []
    const postData = postRes.data?.data
    posts.value = Array.isArray(postData?.records) ? postData.records
                : Array.isArray(postData) ? postData : []
  } catch (e) {
    console.error('搜索加载失败:', e)
  }
}

function goDetail(item) {
  if (item.url !== undefined) {
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
.card-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}
.result-tag {
  flex-shrink: 0;
}
</style>