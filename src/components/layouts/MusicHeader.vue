<template>
  <header class="music-header">
    <div class="header-left">
      <div class="header-title">{{ musicName }}</div>
      <el-input class="header-search" v-model="keywords" placeholder="搜索歌曲" @keyup.enter="goSearch" />
      <el-menu class="header-menu" mode="horizontal" :ellipsis="false" @select="handleHeaderSelect">
        <el-menu-item v-for="item in headerNavList" :key="item.path" :index="item.path">
          {{ item.name }}
        </el-menu-item>
      </el-menu>
    </div>

    <div class="header-right">
      <el-menu v-if="!token" class="sign-menu" mode="horizontal" :ellipsis="false" @select="handleSignSelect">
        <el-menu-item v-for="item in signList" :key="item.path" :index="item.path">
          {{ item.name }}
        </el-menu-item>
      </el-menu>

      <el-dropdown v-else class="user-wrap" trigger="click">
        <div class="user-info">
          <el-image class="user-avatar" fit="cover" :src="avatarUrl" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in menuList" :key="item.path" @click="goMenu(item.path)">
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { attachImageUrl } from '@/utils'

const router = useRouter()
const userStore = useUserStore()

const musicName = '校园音乐平台'
const headerNavList = [
  { name: '首页', path: '/' },
  { name: '歌曲', path: '/song-list' },
  { name: '社区', path: '/community' },
  { name: '上传', path: '/upload' }
]
const signList = [{ name: '登录', path: '/sign-in' }]
const menuList = [
  { name: '个人主页', path: '/user-personal' },
  { name: '编辑资料', path: '/setting' },
  { name: '退出', path: 'logout' }
]
const keywords = ref('')
const token = computed(() => userStore.token)
const avatarUrl = computed(() => attachImageUrl(userStore.avatar))

function handleHeaderSelect(path) {
  router.push(path)
}

function handleSignSelect(path) {
  router.push(path)
}

function goSearch() {
  if (!keywords.value) {
    ElMessage.error('请输入搜索内容')
    return
  }
  router.push({ path: '/search', query: { keyword: keywords.value } })
}

function goMenu(path) {
  if (path === 'logout') {
    userStore.logout()
    router.push('/')
    return
  }
  router.push(path)
}
</script>

<style scoped>
.music-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: #111;
  color: #f5f5f5;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}
.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header-title {
  font-size: 20px;
  font-weight: 700;
  white-space: nowrap;
}
.header-search {
  width: 220px;
}
:deep(.el-input__wrapper) {
  background: #1f1f1f;
  box-shadow: 0 0 0 1px #444 inset;
}
:deep(.el-input__inner) {
  color: #fff;
}
.header-menu, .sign-menu {
  border: none;
  background: transparent;
  --el-menu-hover-bg-color: #222;
  --el-menu-active-color: #fff;
  --el-menu-text-color: #fff;
}
:deep(.header-menu .el-menu-item), :deep(.sign-menu .el-menu-item) {
  color: #f0f0f0;
  height: 64px;
  line-height: 64px;
  font-size: 14px;
  border: none;
}
:deep(.header-menu .el-menu-item:hover), :deep(.sign-menu .el-menu-item:hover) {
  background: transparent !important;
  color: #fff !important;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #444;
}
.user-name {
  font-size: 13px;
}
:deep(.el-dropdown-menu) {
  background: #fff;
  border: 1px solid #eee;
}
:deep(.el-dropdown-menu__item) {
  color: #111;
}
:deep(.el-dropdown-menu__item:hover) {
  background: #f5f5f5 !important;
  color: #111 !important;
}
@media (max-width: 900px) {
  .music-header {
    padding: 0 14px;
    height: auto;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .header-left, .header-right {
    flex-wrap: wrap;
  }
  .header-search {
    width: 180px;
  }
}
</style>