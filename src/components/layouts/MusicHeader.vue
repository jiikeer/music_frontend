<template>
  <header class="music-header" :class="{ scrolled: isScrolled }">
    <div class="header-inner">
      <div class="header-left">
        <div class="header-logo" @click="$router.push('/')">🎵 校园音乐</div>
        <nav class="header-nav">
          <router-link v-for="item in navList" :key="item.path" :to="item.path" class="nav-item" active-class="nav-active">{{ item.name }}</router-link>
        </nav>
      </div>
      <div class="header-center">
        <div class="search-box" @click="showSearch = true">
          <el-icon><Search /></el-icon>
          <span class="search-placeholder">搜索歌曲、歌手、校园音乐人</span>
        </div>
      </div>
      <div class="header-right">
        <el-button v-if="token && !isAdmin" type="primary" round size="small" class="upload-btn" @click="$router.push('/upload')">
          <el-icon><Upload /></el-icon> 上传作品
        </el-button>
        <el-button v-if="!token" type="primary" round size="small" @click="$router.push('/sign-in')">登录</el-button>
        <el-dropdown v-if="token" trigger="click">
          <img :src="avatarUrl" class="user-avatar" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/user-personal')"><el-icon><User /></el-icon> 个人主页</el-dropdown-item>
              <el-dropdown-item @click="$router.push('/setting')"><el-icon><Setting /></el-icon> 编辑资料</el-dropdown-item>
              <el-dropdown-item v-if="isAdmin" @click="goAdmin"><el-icon><Monitor /></el-icon> 后台管理</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout"><el-icon><SwitchButton /></el-icon> 退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div v-if="showSearch" class="search-overlay" @click.self="showSearch = false">
      <div class="search-dialog">
        <el-input v-model="keywords" placeholder="搜索歌曲、歌手、校园音乐人" prefix-icon="Search" size="large" clearable @keyup.enter="goSearch" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { Search, Upload, User, Setting, Monitor, SwitchButton } from '@element-plus/icons-vue'
import { attachImageUrl } from '@/utils'

const router = useRouter()
const userStore = useUserStore()
const isScrolled = ref(false)
const showSearch = ref(false)
const keywords = ref('')
const token = computed(() => userStore.token)
const isAdmin = computed(() => userStore.isAdmin)
const avatarUrl = computed(() => attachImageUrl(userStore.avatar))
const navList = [
  { name: '首页', path: '/' },
  { name: '排行榜', path: '/rank' },
  { name: '歌手', path: '/singer' },
  { name: '社区', path: '/community' }
]
function handleLogout() { userStore.logout(); router.push('/'); ElMessage.success('已退出') }
function goAdmin() { window.open('http://localhost:8080/admin/users', '_blank') }
function goSearch() {
  if (!keywords.value.trim()) return
  showSearch.value = false
  router.push({ path: '/search', query: { keyword: keywords.value.trim() } })
  keywords.value = ''
}
function onScroll() { isScrolled.value = window.scrollY > 40 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.music-header { position: fixed; top: 0; left: 0; right: 0; z-index: 999; height: 60px; background: #fff; transition: background 0.3s, box-shadow 0.3s; }
.music-header.scrolled { background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.header-inner { max-width: 1200px; margin: 0 auto; height: 60px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header-left { display: flex; align-items: center; gap: 28px; }
.header-logo { font-size: 20px; font-weight: 700; color: #ec4141; cursor: pointer; white-space: nowrap; }
.header-nav { display: flex; gap: 4px; }
.nav-item { position: relative; padding: 8px 14px; font-size: 14px; color: #666; text-decoration: none; border-radius: 6px; transition: color 0.3s; }
.nav-item:hover { color: #ec4141; }
.nav-item::after { content: ''; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%) scaleX(0); width: 20px; height: 3px; background: #ec4141; border-radius: 2px; transition: transform 0.3s; }
.nav-item.nav-active::after, .nav-item:hover::after { transform: translateX(-50%) scaleX(1); }
.nav-active { color: #ec4141; font-weight: 600; }
.header-center { flex: 1; max-width: 320px; margin: 0 24px; }
.search-box { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f5f5f7; border-radius: 20px; cursor: pointer; transition: background 0.3s; }
.search-box:hover { background: #ececee; }
.search-placeholder { font-size: 13px; color: #999; }
.header-right { display: flex; align-items: center; gap: 12px; }
.upload-btn { background: #ec4141; border-color: #ec4141; }
.upload-btn:hover { background: #d93939; border-color: #d93939; }
.user-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #eee; cursor: pointer; transition: border-color 0.3s; }
.user-avatar:hover { border-color: #ec4141; }
.search-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 1000; display: flex; justify-content: center; padding-top: 120px; }
.search-dialog { width: 500px; max-width: 90vw; background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
@media (max-width: 900px) { .header-center { display: none; } .header-left { gap: 8px; } .nav-item { padding: 6px 8px; font-size: 13px; } }
</style>