<template>
<div class="favorite-page">
    <!-- 无收藏 -->
    <el-empty
        v-if="favoriteList.length===0"
        description="暂无收藏歌曲"
    />
    <!-- 收藏歌曲列表 -->
    <div
        class="song-list"
        v-else
    >
        <div
            class="song-item"
            v-for="item in favoriteList"
            :key="item.id"
        >
            <!-- 封面 -->
            <el-image
                class="cover"
                :src="getCover(item.cover)"
                fit="cover"
            >
                <template #error>
                    <div class="cover-error">
                        🎵
                    </div>
                </template>
            </el-image>
            <!-- 歌曲信息 -->
            <div class="song-info">
                <div class="song-name">
                    {{item.songName}}
                </div>
                <div class="artist">
                    {{item.artist}}
                </div>
                <div class="collect-time">
                    收藏时间：
                    {{formatTime(item.createTime)}}
                </div>
            </div>
            <!-- 操作 -->
            <div class="operation">
                <el-button
                    class="play-btn"
                    @click="playSong(item)"
                >
                    播放
                </el-button>
                <el-button
                    class="cancel-btn"
                    @click="cancelCollect(item)"
                >
                    取消收藏
                </el-button>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref,onMounted} from "vue";
import {ElMessage,ElMessageBox} from "element-plus";
import {useUserStore} from "@/store/user";
import {getUserCollect, collectSong} from "@/api/song";
import {attachImageUrl} from "@/utils";

const userStore =useUserStore();
const favoriteList =ref([]);
// 获取收藏列表
async function loadFavorite(){
    try{
        const res =
            await getUserCollect(
                userStore.userId
            );
        if(res.success){
            favoriteList.value =
                res.data;
        }
    }catch(error){
        console.log(error);
        ElMessage.error(
            "获取收藏失败"
        );
    }
}
// 图片处理
function getCover(url){
    return attachImageUrl(url);
}
// 时间格式化
function formatTime(time){
    if(!time)
        return "";
    return time.substring(
        0,
        10
    );
}
// 播放歌曲
function playSong(song){
    console.log(
        "播放:",
        song
    );
    ElMessage.success(
        "播放 "+song.songName
    );
}
// 取消收藏
async function cancelCollect(song){
    try{
        await ElMessageBox.confirm(
            "确定取消收藏吗？",
            "提示",
            {
                confirmButtonText:"确定",
                cancelButtonText:"取消"
            }
        );
        const res =
            await collectSong({
                userId:userStore.userId,
                songId:song.songId
            });
        if(res.success){
            ElMessage.success(
                "取消收藏成功"
            );
            loadFavorite();
        }
    }catch(e){
        console.log(e);
    }
}
onMounted(()=>{
    loadFavorite();
});
</script>
<style scoped>
.favorite-page{
    color:white;
    padding:40px 60px;
}
.song-list{
    display:flex;
    flex-direction:column;
    gap:20px;
}
.song-item{
    height:110px;
    background:#252525;
    border-radius:12px;
    display:flex;
    align-items:center;
    padding:15px 25px;
}
.cover{
    width:80px;
    height:80px;
    border-radius:10px;
}
.cover-error{
    width:80px;
    height:80px;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#333;
    font-size:30px;
}
.song-info{
    margin-left:25px;
    flex:1;
}
.song-name{
    font-size:22px;
    margin-bottom:8px;
}
.artist{
    color:#aaa;
}
.collect-time{
    color:#777;
    font-size:14px;
    margin-top:8px;
}
.operation{
    display:flex;
    gap:15px;
}
.play-btn{
    background:white!important;
    color:black!important;
    border:none!important;
}
.play-btn:hover{
    background:#ddd!important;
}
.cancel-btn{
    background:transparent!important;
    border:1px solid #666!important;
    color:white!important;
}
.cancel-btn:hover{
    background:transparent!important;
    border-color:#aaa!important;
}
</style>