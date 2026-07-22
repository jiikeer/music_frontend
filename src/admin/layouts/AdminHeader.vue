<template>
  <div class="admin-header">
    <span class="title">后台管理系统</span>
    <div class="right">
      <span class="admin-name">{{ userStore.username }}</span>
      <el-dropdown>
        <span class="user-info">
          管理员<el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
  userStore.logout()
  router.replace('/sign-in')
}
</script>

<style scoped>
.admin-header {
  width: 100%;
  display: flex;
  align-items: center;
}
.title {
  font-size: 18px;
  font-weight: bold;
  flex: 1;
}
.right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 15px;
}
.admin-name {
  color: #666;
}
.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
