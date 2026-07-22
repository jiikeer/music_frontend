<template>
  <el-container class="admin-layout">
    <el-aside width="200px">
      <AdminAside />
    </el-aside>
    <el-container>
      <el-header>
        <AdminHeader />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import AdminAside from './AdminAside.vue'
import AdminHeader from './AdminHeader.vue'
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}
.el-aside {
  background-color: #304156;
  color: #fff;
  transition: width 0.3s;
}
.el-aside.collapsed {
  width: 64px !important;
}
.el-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}
.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
