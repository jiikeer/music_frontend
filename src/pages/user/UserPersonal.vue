<template>
  <div class="personal-page">
    <!-- 深色用户卡片 -->
    <div class="user-card">
      <!-- 头像区域 -->
      <div class="avatar-section">
        <el-image
          class="avatar"
          :src="avatarUrl"
          fit="cover"
        />
      </div>

      <div class="info-section">
        <h2 class="username">{{ userName }}</h2>
        <div class="actions-row">
          <div class="action-item" @click="goHome">
            <span>返回首页</span>
            <span class="arrow">></span>
          </div>
          <div class="action-item" @click="handleLogout">
            <span>退出登录</span>
            <span class="arrow">></span>
          </div>
        </div>
      </div>

      <!-- 右侧账号设置 -->
      <div class="space-entry" @click="$router.push('/setting')">
        <span>账号设置</span>
        <span class="arrow">></span>
      </div>
    </div>

    <!-- 底部标签栏 -->
    <div class="tab-bar">
      <button
        v-for="tab in tabList"
        :key="tab.index"
        :class="['tab-btn', { active: activeTab === tab.index }]"
        @click="switchTab(tab.index)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 内容渲染区域 -->
    <div class="content-area">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import { attachImageUrl } from "@/utils";
import { ElMessage, ElMessageBox } from "element-plus";

// 引入标签对应子页面
import UserPost from './UserPost.vue'
import UserFavorite from './UserFavorite.vue'
import UserLike from './UserLike.vue'

const router = useRouter();
const userStore = useUserStore();

// 头像地址拼接
const avatarUrl = computed(() => {
  const path = userStore.avatar;
  return attachImageUrl(path);
});

// 用户名兜底
const userName = computed(() => {
  return userStore.username || "默认用户";
});

// 标签配置
const tabList = [
  { index: "1", label: "作品" },
  { index: "2", label: "收藏" },
  { index: "3", label: "点赞" },
];
const activeTab = ref("1");

// 顶部引入空占位
const EmptyComp = { template: '<div></div>' }

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case "1": return UserPost;
    case "2": return UserFavorite;
    case "3": return UserLike;
    // 不返回 null，返回空组件
    default: return EmptyComp;
  }
});

// 切换标签
function switchTab(index) {
  activeTab.value = index;
}

// 返回首页
function goHome() {
  router.push("/");
}

// 退出登录弹窗
async function handleLogout() {
  try {
    await ElMessageBox.confirm("确定要退出当前账号？", "操作提示", {
      confirmButtonText: "确认退出",
      cancelButtonText: "取消",
      type: "warning",
    });
    userStore.logout();
    router.push("/");
    ElMessage.success("已退出登录");
  } catch {
    // 捕获取消操作，无报错
  }
}
</script>

<style scoped>
.personal-page {
  min-height: 100vh;
  color: #fff;
  padding: 20px;
}

/* 顶部深色卡片 */
.user-card {
  background-color: #2c2c2c;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

/* 头像样式统一 */
.avatar-section .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #444;
  cursor: default;
}

.info-section {
  flex: 1;
}
.username {
  font-size: 30px;
  font-weight: 500;
  margin: 0 0 30px;
  color: #fff;
}
.actions-row {
  display: flex;
  gap: 32px;
}
.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s;
}
.action-item:hover {
  color: #fff;
}

/* 右侧账号设置 */
.space-entry {
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  cursor: pointer;
}
.space-entry .arrow {
  font-size: 20px;
}

/* 底部标签栏 */
.tab-bar {
  display: flex;
  gap: 40px;
  border-bottom: 1px solid #eee;
  margin-bottom: 30px;
}
.tab-btn {
  border: none;
  background: none;
  font-size: 20px;
  color: #666;
  padding: 10px 0;
  cursor: pointer;
  position: relative;
}
.tab-btn.active {
  color: #333;
  font-weight: 600;
}
.tab-btn.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #333;
  border-radius: 3px;
}

/* 子组件内容区域 */
.content-area {
  min-height: 300px;
  color: #000;
}
</style>