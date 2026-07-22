<template>
  <el-menu
    :collapse="collapse"
    :collapse-transition="false"
    router
    background-color="#304156"
    text-color="#bfcbd9"
    active-text-color="#409EFF"
    default-active="/admin/users"
  >
    <el-menu-item index="/admin/users">
      <el-icon><User /></el-icon>
      <template #title>用户管理</template>
    </el-menu-item>
    <el-menu-item index="/admin/songs">
      <el-icon><Headset /></el-icon>
      <template #title>歌曲管理</template>
    </el-menu-item>
    <el-menu-item index="/admin/posts">
      <el-icon><EditPen /></el-icon>
      <template #title>帖子管理</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { User, Headset, EditPen } from '@element-plus/icons-vue'

defineProps(['collapse'])
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>
