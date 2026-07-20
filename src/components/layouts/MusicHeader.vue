<template>
<header class="music-header">
    <!-- 左侧区域 -->
    <div class="header-left">
        <!-- 网站名称 -->
        <div class="header-title">
            {{ musicName }}
        </div>
        <!-- 搜索框 -->
        <el-input
            class="header-search"
            v-model="keywords"
            placeholder="搜索歌曲"
            @keyup.enter="goSearch"
        />
        <!-- 导航 -->
        <el-menu
            class="header-menu"
            mode="horizontal"
            :ellipsis="false"
            @select="handleHeaderSelect"
        >
            <el-menu-item
                v-for="item in headerNavList"
                :key="item.path"
                :index="item.path"
            >
                {{item.name}}
            </el-menu-item>
        </el-menu>
    </div>

    <!-- 右侧 -->
    <div class="header-right">
        <!-- 未登录 -->
        <el-menu
            v-if="!token"
            class="sign-menu"
            mode="horizontal"
            :ellipsis="false"
            @select="handleSignSelect"
        >
            <el-menu-item
                v-for="item in signList"
                :key="item.path"
                :index="item.path"
            >
                {{item.name}}
            </el-menu-item>
        </el-menu>

        <!-- 已登录：头像下拉 -->
        <el-dropdown
            v-else
            class="user-wrap"
            trigger="click"
        >
            <el-image 
                class="user-avatar" 
                fit="cover" 
                :src="attachImageUrl(userPic)"
            />
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item
                        v-for="item in menuList"
                        :key="item.path"
                        @click="goMenu(item.path)"
                    >
                        {{item.name}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</header>
</template>

<script setup>
import {ref,computed} from "vue";
import {useRouter} from "vue-router";
import { useUserStore } from "../../store/user";
import { useConfigureStore } from "../../store/configure";
import {ElMessage} from "element-plus";
// 恢复utils导入，路径正确
import { attachImageUrl } from "@/utils";

const router = useRouter();
const userStore =useUserStore();
const configureStore =useConfigureStore();

// 平台名称
const musicName="校园音乐平台";

const headerNavList=[
    {
        name:"首页",
        path:"/"
    },
    {
        name:"社区",
        path:"/community"
    },
    {
        name:"上传",
        path:"/upload"
    }
];

// 登录
const signList=[
    {
        name:"登录",
        path:"/sign-in"
    }
];

// 用户菜单
const menuList=[
    {
        name:"个人主页",
        path:"/personal"
    },
    {
        name:"设置",
        path:"/setting"
    },
    {
        name:"退出",
        path:"logout"
    }
];

const keywords=ref("");

// 用户状态
const token=computed(()=>{
    return configureStore.token;
});
// 注释掉未使用的username，消除eslint报错
// const username=computed(()=>{
//     return userStore.username;
// });
const userPic = computed(() => userStore.userPic);

function handleHeaderSelect(path){
    router.push(path);
}

function handleSignSelect(path){
    router.push(path);
}

function goSearch(){
    if(!keywords.value){
        ElMessage.error("请输入搜索内容");
        return;
    }
    router.push({
        path:"/search",
        query:{
            keyword:keywords.value
        }
    });
}

function goMenu(path){
    if(path==="logout"){
        configureStore.setToken(false);
        userStore.logout();
        router.push("/");
        return;
    }
    router.push(path);
}
</script>

<style scoped>
.music-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: #ffffff;
  box-shadow: 0 2px 8px #ddd;
  position: fixed;
  top: 0;
  left: 0;
  right: 0; 
  z-index: 100;
  overflow: hidden; 
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 0; 
}

.header-title {
  font-size: 22px;
  font-weight: bold;
  flex-shrink: 0;
  white-space: nowrap; 
}

.header-search {
  width: 250px;
  max-width: 250px;
  min-width: 140px;
  flex-shrink: 1;
}

.header-menu {
  border: none;
  flex-shrink: 1;
}

.header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 24px;
}

.user-wrap {
  display: flex;
  align-items: center;
}
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #eee;
}
</style>