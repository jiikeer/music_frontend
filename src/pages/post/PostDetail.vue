<template>
<div class="detail-page">
    <div
        class="detail-card"
        v-if="post"
    >
        <!-- 返回 -->
        <div 
            class="back"
            @click="$router.back()"
        >
            ← 返回
        </div>

        <!-- 封面 -->
        <img
            :src="getImage(post.cover)"
            class="cover"
        />

        <!-- 标题 -->
        <h1>
            {{post.title}}
        </h1>

        <!-- 内容 -->
        <div class="content">
            {{post.content}}
        </div>

        <!-- 时间 -->
        <div class="time">
            发布时间：
            {{formatTime(post.createTime)}}
        </div>

        <!-- 审核状态 -->
        <div
            class="audit-status"
            :class="getStatusClass(post.status)"
        >
            {{getStatusText(post.status)}}
        </div>

        <!-- 数据 -->
        <div class="statistics">
            <span class="stat-item">
                <el-icon><Star /></el-icon>
                {{post.likeCount}}
            </span>
            <span class="stat-item">
                <el-icon><ChatDotRound /></el-icon>
                {{post.commentCount}}
            </span>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted} from "vue";
import { useRoute} from "vue-router";
import { getPostDetail} from "@/api/post";
import { attachImageUrl} from "@/utils";
import { Star, ChatDotRound } from '@element-plus/icons-vue'

const route = useRoute();
const post = ref(null);

function getImage(path){
    return attachImageUrl(path);
}

function formatTime(time){
    if(!time)
        return "";
    return time.replace("T"," ");
}

function getStatusText(status){
    switch(status){
        case 1:
            return "审核通过";
        case 0:
            return "待审核";
        case 2:
            return "审核未通过";
        default:
            return "未知";
    }
}

function getStatusClass(status){
    return {
        success:status===1,
        waiting:status===0,
        failed:status===2
    }
}

async function loadData(){
    const id = route.params.id;
    const res = await getPostDetail(id);
    post.value = res.data.data;
}

onMounted(()=>{
    loadData();
});
</script>

<style scoped>
.detail-page{
    padding:40px;
}

.detail-card{
    background:white;
    border-radius:15px;
    padding:40px;
    box-shadow:
    0 5px 20px rgba(0,0,0,.08);
}

.back{
    cursor:pointer;
    color:#666;
    margin-bottom:20px;
}

.cover{
    width:500px;
    height:280px;
    object-fit:cover;
    border-radius:12px;
}

h1{
    font-size:32px;
    margin:30px 0;
}

.content{
    font-size:18px;
    line-height:2;
    color:#444;
}

.time{
    margin-top:25px;
    color:#999;
}

.audit-status{
    margin-top:20px;
    display:inline-block;
    padding:6px 15px;
    border-radius:20px;
}

.success{
    color:#16a34a;
    background:#dcfce7;
}

.waiting{
    color:#ca8a04;
    background:#fef9c3;
}

.failed{
    color:#dc2626;
    background:#fee2e2;
}

.statistics{
    margin-top:30px;
    display:flex;
    gap:30px;
    font-size:18px;
}
.stat-item{
    display: flex;
    align-items: center;
    gap:6px;
}
</style>