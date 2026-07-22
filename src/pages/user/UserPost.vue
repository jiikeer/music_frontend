<template>
<div class="works-page">
    <!-- 顶部切换 -->
    <div class="work-tabs">
        <button
            :class="{active:type==='post'}"
            @click="type='post'"
        >
            我的帖子
        </button>
        <button
            :class="{active:type==='song'}"
            @click="type='song'"
        >
            我的歌曲
        </button>
    </div>
    <!-- ================= 帖子 ================= -->
    <div v-if="type==='post'" class="card-list">
        <el-empty
            v-if="postList.length===0"
            description="暂无发布帖子"
        />
        <div
            class="post-card"
            v-for="item in postList"
            :key="item.id"
        >
            <!-- 封面 -->
            <img
                v-if="item.cover"
                :src="getImage(item.cover)"
                class="cover"
            >
            <div class="post-info">
                <h3>
                    {{item.title}}
                </h3>
                <p class="content">
                    {{item.content}}
                </p>
                <div class="time">
                    发布时间：
                    {{formatTime(item.createTime)}}
                </div>
                <div 
                    class="audit-status"
                    :class="getStatusClass(item.status)"
                >
                    {{getStatusText(item.status)}}
                </div>
            </div>
            <div class="card-action">
            <el-dropdown>
                <el-icon class="more-icon">
                    <MoreFilled />
                </el-icon>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item
                            @click="viewPost(item.id)"
                        >
                            查看详情
                        </el-dropdown-item>
                        <el-dropdown-item
                            divided
                            @click="handleDeletePost(item.id)"
                        >
                            删除帖子
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            </div>
        </div>
    </div>

    <!-- ================= 歌曲 ================= -->
    <div v-if="type==='song'" class="song-list">
        <el-empty
            v-if="songList.length===0"
            description="暂无上传歌曲"
        />
        <div
            class="song-card"
            v-for="song in songList"
            :key="song.id"
        >
            <div class="song-icon">
                🎵
            </div>
            <div class="song-info">
                <h3>
                    {{song.name}}
                </h3>
                <p>
                    上传时间：
                    {{formatTime(song.createTime)}}
                </p>
                <!-- 审核状态 -->
                <div
                    class="audit-status"
                    :class="getStatusClass(song.status)"
                >
                    {{getStatusText(song.status)}}
                </div>
            </div>
            
            <audio v-if="song.url" controls
                :src="getImage(song.url)"
            />
            <div class="card-action">
                <el-dropdown>
                    <el-icon class="more-icon">
                        <MoreFilled />
                    </el-icon>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item
                                @click="viewSong(song.id)"
                            >
                                查看详情
                            </el-dropdown-item>
                            <el-dropdown-item
                                divided
                                @click="handleDeleteSong(song.id)"
                            >
                                删除歌曲
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>
</div>
</template>


<script setup>
import { ref, onMounted} from "vue";
import { useUserStore} from "@/store/user";
import { getUserPosts, deletePost} from "@/api/post";
import { getUserSongs, deleteSong} from "@/api/song";
import { attachImageUrl} from "@/utils";
import { ElMessage, ElMessageBox} from "element-plus";
import { MoreFilled } from "@element-plus/icons-vue";
import { useRouter } from "vue-router"

const router = useRouter()
const userStore = useUserStore();
// 当前显示类型
const type = ref("post");
// 帖子
const postList = ref([]);
// 歌曲
const songList = ref([]);
// 图片地址处理
function getImage(path){
    if(!path){
        return "";
    }
    return attachImageUrl(path);
}
// 时间格式化
function formatTime(time){
    if(!time){
        return "";
    }
    return time.replace("T"," ");
}
// 审核状态文字
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

// 审核状态样式
function getStatusClass(status){
    return {
        success:status===1,
        waiting:status===0,
        failed:status===2
    }
}
// 加载作品
async function loadWorks(){
    const userId = userStore.userId;
    console.log("当前用户ID:",userId);
    if(!userId){
        console.log("用户ID不存在");
        return;
    }
    try{
        const postRes =
            await getUserPosts(userId);
        console.log(
            "帖子接口返回:",
            postRes
        );
        postList.value =
            postRes.data.data  || [];
        const songRes = await getUserSongs(userId);
        console.log(
            "歌曲接口返回:",
            songRes
        );
        songList.value =
            songRes.data.data || [];
    }
    catch(e){
        console.error(
            "加载作品失败",
            e
        );
    }
}
// 跳转详情
function viewPost(id) {
    router.push(`/user/post/detail/${id}`)
}
function viewSong(id) {
    router.push(`/user/song/detail/${id}`)
}
async function handleDeletePost(id){
    try{
        await ElMessageBox.confirm(
            "确定删除该帖子吗？",
            "删除提示",
            {
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:"warning"
            }
        );
        const res = await deletePost( id, userStore.userId );
        if(res.data.code===200){
            ElMessage.success(
                "删除成功"
            );
            loadWorks();
        }
    }
    catch(e){
        console.log(
            "取消删除", e
        );
    }
}
async function handleDeleteSong(id){
    try{
        await ElMessageBox.confirm(
            "确定删除该歌曲吗？",
            "删除提示",
            {
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:"warning"
            }
        );
        const res = await deleteSong(id);
        if(res.data.code===200){
            ElMessage.success(
                "删除成功"
            );
            loadWorks();
        }
    }
    catch(e){
        console.log(
            "取消删除", e
        );
    }
}
onMounted(()=>{ loadWorks();});
</script>

<style scoped>
.works-page{
    width:100%;
}

/* 顶部tab */
.work-tabs{
    display:flex;
    gap:30px;
    margin-bottom:25px;
    border-bottom:1px solid #ddd;
}

.work-tabs button{
    border:none;
    background:none;
    padding:10px 20px;
    font-size:18px;
    cursor:pointer;
    color:#666;
}

.work-tabs button.active{
    color:#000;
    font-weight:bold;
    border-bottom:3px solid #000;
}

/* ===================
    帖子
=================== */
.card-list{
    display:flex;
    flex-direction:column;
    gap:20px;
}

.post-card{
    display:flex;
    align-items:center;
    background:white;
    border-radius:12px;
    padding:20px;
    box-shadow:
    0 4px 12px rgba(0,0,0,.08);
    position:relative;
}
.cover{
    width:180px;
    height:120px;
    object-fit:cover;
    border-radius:10px;
    margin-right:20px;
}
.post-info{
    flex:1;
}

.post-info h3{
    margin:0 0 15px;
    font-size:22px;
}
.content{
    color:#666;
    line-height:1.6;
}

.time{
    margin-top:15px;
    color:#999;
    font-size:14px;
}
/* ===================
    歌曲
=================== */
.song-list{
    display:flex;
    flex-direction:column;
    gap:15px;
}
.song-card{
    display:flex;
    align-items:center;
    gap:20px;
    padding:20px;
    background:white;
    border-radius:12px;
    box-shadow:
    0 4px 12px rgba(0,0,0,.08);
}
.song-icon{
    width:50px;
    height:50px;
    border-radius:50%;
    background:#222;
    color:white;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:25px;
}
.song-info{
    flex:1;
}
.song-info h3{
    margin:0 0 8px;
}
.song-info p{
    color:#999;
}
audio{
    width:260px;
}
.audit-status{
    margin-top:10px;
    display:inline-block;
    padding:4px 12px;
    border-radius:20px;
    font-size:14px;
}

/*审核通过*/
.audit-status.success{
    color:#16a34a;
    background:#dcfce7;
}
/*待审核*/
.audit-status.waiting{
    color:#ca8a04;
    background:#fef9c3;
}
/*审核失败*/
.audit-status.failed{
    color:#dc2626;
    background:#fee2e2;
}
</style>