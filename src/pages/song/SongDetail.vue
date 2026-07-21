<template>
<div class="song-detail-page">
    <!-- 返回 -->
    <div 
        class="back"
        @click="$router.back()"
    >
         ← 返回
    </div>
    <!-- 顶部歌曲信息 -->
    <div class="song-header">

        <!-- 左侧封面 -->
        <div class="cover-box">
            <img
                :src="getImage(song.cover)"
                class="song-cover"
            >
        </div>
        <!-- 右侧信息 -->
        <div class="song-info">
            
            <h1>
                {{song.name}}
            </h1>
            <div class="time">
                上传时间：
                {{formatTime(song.createTime)}}
            </div>
            <!-- 数据统计 -->
            <div class="statistics">
                <div class="stat-item">
                    <el-icon>
                        <VideoPlay/>
                    </el-icon>
                    <span>
                        {{song.playCount || 0}}
                    </span>
                </div>
                <div class="stat-item">
                    <el-icon>
                        <Star/>
                    </el-icon>
                    <span>
                        {{song.collectCount || 0}}
                    </span>
                </div>
            </div>
            <!-- 播放器 -->
            <audio
                v-if="song.url"
                controls
                :src="getImage(song.url)"
                class="audio"
            />
            <!-- 审核状态 -->
            <div
                class="audit-status"
                :class="getStatusClass(song.status)"
            >
                {{getStatusText(song.status)}}
            </div>
            <!-- 驳回原因 -->
            <div
                v-if="song.status===2"
                class="reject-box"
            >
                <el-icon>
                    <Warning/>
                </el-icon>
                驳回原因：
                {{song.auditReason || "暂无原因"}}
            </div>
        </div>
    </div>
    <!-- 歌词区域 -->
    <div class="lyric-box">
        <h2>
            <el-icon>
                <Document/>
            </el-icon>
            歌词
        </h2>
        <div class="lyric-content">
            <p
                v-for="(line,index) in lyrics"
                :key="index"
            >
                {{line}}
            </p>
        </div>
    </div>
</div>
</template>

<script setup>
import {  ref,  onMounted} from "vue";
import { useRoute} from "vue-router";
import { getSongDetail} from "@/api/song";
import { attachImageUrl} from "@/utils";
import {VideoPlay, Star, Warning,Document} from "@element-plus/icons-vue";

const route = useRoute();
const song = ref({});
// 歌词
const lyrics = ref([]);
function getImage(path){
    if(!path)
        return "";
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
            return "未知状态";
    }
}
function getStatusClass(status){
    return {
        success:status===1,
        waiting:status===0,
        failed:status===2
    }
}
async function loadDetail(){
    const id =
        route.params.id;
    const res =
        await getSongDetail(id);
    song.value =
        res.data.data;
    /*
        假设后端返回:

        lyric:
        "第一句歌词\n第二句歌词"

    */
    if(song.value.lyric){
        lyrics.value =
            song.value.lyric.split("\n");
    }
}
onMounted(()=>{
    loadDetail();
});
</script>

<style scoped>
.song-detail-page{
    padding:30px;
}
/* 顶部 */
.song-header{
    display:flex;
    gap:40px;
    background:white;
    padding:30px;
    border-radius:16px;
    box-shadow:
    0 5px 20px rgba(0,0,0,.08);
}
.cover-box{
    width:260px;
}
.song-cover{
    width:260px;
    height:260px;
    object-fit:cover;
    border-radius:15px;
}
.song-info{
    flex:1;
}
.song-info h1{
    font-size:36px;
    margin-bottom:20px;
}
.time{
    color:#777;
    margin-bottom:15px;
}
.statistics{
    display:flex;
    gap:40px;
    margin:25px 0;
}
.stat-item{
    display:flex;
    align-items:center;
    gap:8px;
    color:#666;
    font-size:18px;
}
.stat-item .el-icon{
    font-size:24px;
}
.audio{
    width:500px;
}
/*审核*/
.audit-status{
    display:inline-block;
    padding:6px 18px;
    border-radius:20px;
    margin-top:20px;
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
.reject-box{
    margin-top:20px;
    padding:15px;
    background:#fff1f2;
    color:#dc2626;
    border-radius:10px;
}
/*歌词*/
.lyric-box{
    margin-top:30px;
    background:white;
    border-radius:16px;
    padding:30px;
}
.lyric-box h2{
    display:flex;
    align-items:center;
    gap:10px;
}
.lyric-content{
    margin-top:20px;
    line-height:2;
    color:#555;
    font-size:18px;
}

.back{
    cursor:pointer;
    color:#666;
    margin-bottom:20px;
}
</style>