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
<div class="user-info">
    <el-image
        class="user-avatar"
        fit="cover"
        :src="avatarUrl"
    />
</div>
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
import {ElMessage} from "element-plus";
import { attachImageUrl } from "@/utils";

const router = useRouter();
const userStore =useUserStore();

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

const token=computed(()=>{
    return userStore.token;
});
const avatarUrl = computed(() => {
  const avatarPath = userStore.avatar;
  return attachImageUrl(avatarPath);
});

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
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  border-bottom: 1px solid #eeeeee;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.header-title {
  font-size: 22px;
  font-weight: 700;
  color:#111111;
  flex-shrink:0;
  white-space:nowrap;
}

.header-search {
  width:250px;
  max-width:250px;
  min-width:140px;
}

:deep(.el-input__wrapper){
  background:#fafafa;
  box-shadow:0 0 0 1px #dddddd inset;
}
:deep(.el-input__inner){
  color:#111;
}
:deep(.el-input__wrapper:hover){
  box-shadow:0 0 0 1px #111 inset;
}
.user-info{
    display:flex;
    align-items:center;
    gap:10px;
    cursor:pointer;
}
.user-avatar{
    width:36px;
    height:36px;
    border-radius:50%;
    object-fit:cover;
}
.header-menu{
    border:none;
    background:#fff;
    --el-menu-hover-bg-color:#111;
    --el-menu-active-color:#fff;
    --el-menu-text-color:#333;
}

:deep(.header-menu .el-menu-item){
    color:#333;
    height:60px;
    line-height:60px;
    font-size:15px;
    border:none;
}

:deep(.header-menu .el-menu-item:hover){
    border-bottom:#111 solid 2px;
    background:transparent !important;
    color:#111 !important;
}

:deep(.header-menu .el-menu-item.is-active){
    border-bottom:#111 solid 2px;
    background:transparent !important;
    color:#111 !important;
    border-bottom:none !important;
}
.sign-menu{
    border:none;
    background:#fff;
    --el-menu-active-color:#fff;
}

:deep(.sign-menu .el-menu-item){
    border:none;
}

:deep(.sign-menu .el-menu-item:hover){
    border-bottom:#111 solid 2px;
    color:#111 !important;
    background:transparent ;
}
:deep(.sign-menu .el-menu-item.is-active){
    border-bottom:#111 solid 2px;
    color:#111 !important;
    background:transparent !important;
}

/* ========== 下拉用户菜单 统一登录导航样式（修复移出蓝底残留） ========== */
:deep(.el-dropdown-menu) {
  border: none;
  background: #fff;
  padding: 0;
}

:deep(.el-dropdown-menu__item) {
  border: none;
  font-size: 15px;
  color: #6c6c6c;
  padding: 0 20px;
  height: 48px;
  line-height: 48px;
  outline: none !important;
}

:deep(.el-dropdown-menu__item:not(.is-disabled):hover) {
  color: #111 !important;
  background: transparent !important;
}

:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  color: #111 !important;
  background: transparent !important;
}

:deep(.el-dropdown-menu__item.is-hovering) {
  color: #111 !important;
  background: transparent !important;
}

:deep(.el-dropdown-menu__item:hover),
:deep(.el-dropdown-menu__item:focus),
:deep(.el-dropdown-menu__item.is-hovering) {
  background-color: transparent !important;
}
</style>