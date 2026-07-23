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
            <!-- 标题 -->
            <h1>
                {{post.title}}
            </h1>

            <!-- 封面 -->
            <img
                :src="getImage(post.cover)"
                class="cover"
            />

        <!-- 内容 -->
        <div class="content">
            {{post.content}}
        </div>

        <!-- 时间 -->
        <div class="time">
            发布时间：
            {{formatTime(post.createTime)}}
        </div>

        <!-- 审核状态已移除 -->

        <!-- 数据 -->
        <div class="statistics">
            <span class="stat-item like" :class="{ liked: post.isLiked }" @click="toggleLike" style="cursor:pointer;">
                <el-icon>
                    <component :is="post.isLiked ? StarFilled : Star" />
                </el-icon>
                <span class="like-count">{{post.likeCount}}</span>
            </span>
        </div>
        <!-- 评论区 -->
        <div class="comments" v-if="post">
            <h3>评论（{{ post.commentCount || comments.length }}）</h3>
            <div class="comment-list">
                <div class="comment-item" v-for="c in comments" :key="c.id">
                    <div class="comment-user">{{ c.username || c.userId || '匿名' }}</div>
                    <div class="comment-content">{{ c.content }}</div>
                    <div class="comment-time">{{ formatTime(c.createTime) }}</div>
                    <div class="comment-actions">
                        <span class="like-btn" :class="{ liked: c.isLiked }" @click="toggleCommentLike(c)">
                            <el-icon><component :is="c.isLiked ? StarFilled : Star" /></el-icon>
                            <span class="like-count">{{ c.likeCount || 0 }}</span>
                        </span>
                        <el-button size="mini" type="text" @click="replyVisible[c.id] = !replyVisible[c.id]">回复</el-button>
                        <el-button v-if="c.userId && c.userId==userId" size="mini" type="text" @click="removeComment(c.id)">删除</el-button>
                    </div>

                    <div v-if="replyVisible[c.id]" class="reply-box">
                        <el-input type="textarea" v-model="replyTexts[c.id]" :rows="2" placeholder="写回复..." />
                        <div style="text-align:right;margin-top:8px;">
                            <el-button size="small" type="primary" @click="submitReply(c.id)">发送回复</el-button>
                        </div>
                    </div>

                    <div class="replies" v-if="c.replies && c.replies.length">
                        <div class="reply-item" v-for="r in c.replies" :key="r.id">
                            <div class="comment-user">{{ r.username || r.userId || '匿名' }} 回复</div>
                            <div class="comment-content">{{ r.content }}</div>
                            <div class="comment-time">{{ formatTime(r.createTime) }}</div>
                            <div class="comment-actions">
                                <span class="like-btn" :class="{ liked: r.isLiked }" @click="toggleCommentLike(r)">
                                    <el-icon><component :is="r.isLiked ? StarFilled : Star" /></el-icon>
                                    <span class="like-count">{{ r.likeCount || 0 }}</span>
                                </span>
                                <el-button v-if="r.userId && r.userId==userId" size="mini" type="text" @click="removeComment(r.id)">删除</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="comment-form">
                <el-input type="textarea" v-model="newComment" :rows="3" placeholder="写下你的评论..." />
                <div style="margin-top:8px;text-align:right;">
                    <el-button type="primary" @click="submitComment">发表评论</el-button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getPostDetail, getPostComments, addPostComment, deletePostComment, likePost, likePostComment } from "@/api/post";
import { attachImageUrl } from "@/utils";
import { Star, StarFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { computed } from 'vue'

const route = useRoute();
const post = ref(null);
const comments = ref([])
const newComment = ref('')
const replyTexts = ref({})
const replyVisible = ref({})
const userStore = useUserStore()
const userId = computed(()=>userStore.userId)

function getImage(path){
    return attachImageUrl(path);
}

function formatTime(time){
    if(!time) return ''
    const d = new Date(time)
    const now = new Date()
    const diffMs = now - d
    const oneHour = 1000 * 60 * 60
    const oneDay = oneHour * 24
    if (diffMs >= 0 && diffMs < oneDay) {
        const hours = Math.floor(diffMs / oneHour)
        if (hours >= 1) return `${hours}小时前`
        const minutes = Math.floor(diffMs / (1000 * 60))
        if (minutes >= 1) return `${minutes}分钟前`
        return '刚刚'
    }
    const pad = (n)=>String(n).padStart(2,'0')
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// 审核状态展示已移除

async function loadData(){
    const id = route.params.id;
    const res = await getPostDetail(id);
    post.value = res.data.data;
    if(post.value && post.value.isLiked===undefined){
        post.value.isLiked = false
    }
    await loadComments()
}

async function loadComments(){
    const id = route.params.id
    try{
        const res = await getPostComments(id, userId.value || undefined)
        const raw = res.data.data || []
        // build nested comments (replies)
        const map = {}
        raw.forEach(c=>{ c.replies = []; map[c.id]=c })
        const roots = []
        raw.forEach(c=>{
            if(c.parentId && map[c.parentId]){
                map[c.parentId].replies.push(c)
            }else{
                roots.push(c)
            }
        })
        comments.value = roots
    }catch(e){
        comments.value = []
    }
}

async function submitComment(){
    if(!newComment.value || !newComment.value.trim()){
        ElMessage.error('评论内容不能为空')
        return
    }
    if(!userId.value){ ElMessage.error('请先登录'); return }
    const payload = {
        targetId: Number(route.params.id),
        userId: Number(userId.value),
        content: newComment.value
    }
    try{
        await addPostComment(payload)
        ElMessage.success('评论已发布')
        newComment.value = ''
        await loadComments()
        // 更新帖子评论数（如果后端不返回最新数量，根据树计算数量）
        if(post.value){
            post.value.commentCount = comments.value.reduce((sum,c)=>sum+1+(c.replies?c.replies.length:0),0)
        }
    }catch(e){
        ElMessage.error('发表评论失败')
    }
}

async function submitReply(commentId){
    const text = (replyTexts.value[commentId]||'').trim()
    if(!text){
        ElMessage.error('回复内容不能为空')
        return
    }
    if(!userId.value){ ElMessage.error('请先登录'); return }
    const payload = {
        targetId: Number(route.params.id),
        userId: Number(userId.value),
        content: text,
        parentId: commentId
    }
    try{
        await addPostComment(payload)
        ElMessage.success('回复已发布')
        replyTexts.value[commentId] = ''
        replyVisible.value[commentId] = false
        await loadComments()
        if(post.value){ post.value.commentCount = comments.value.reduce((sum,c)=>sum+1+(c.replies?c.replies.length:0),0) }
    }catch(e){
        ElMessage.error('回复失败')
    }
}

async function removeComment(commentId){
    if(!userId.value){ ElMessage.error('请先登录'); return }
    try{
        await deletePostComment(commentId, userId.value)
        ElMessage.success('评论已删除')
        await loadComments()
        if(post.value){ post.value.commentCount = comments.value.reduce((sum,c)=>sum+1+(c.replies?c.replies.length:0),0) }
    }catch(e){
        ElMessage.error('删除评论失败')
    }
}

async function toggleLike(){
    if(!userId.value){ ElMessage.error('请先登录'); return }
    try{
        await likePost({ userId: userId.value, postId: route.params.id })
        // optimistically toggle
        if(!post.value) return
        if(!post.value.isLiked){
            post.value.isLiked = true
            post.value.likeCount = (post.value.likeCount||0)+1
            ElMessage.success('已点赞')
        }else{
            post.value.isLiked = false
            post.value.likeCount = Math.max(0,(post.value.likeCount||1)-1)
            ElMessage.success('已取消点赞')
        }
    }catch(e){
        ElMessage.error('点赞失败')
    }
}

async function toggleCommentLike(c){
    if(!userId.value){ ElMessage.error('请先登录'); return }
    try{
        await likePostComment({ userId: Number(userId.value), commentId: c.id })
        // 乐观更新
        if(c.isLiked){
            c.isLiked = false
            c.likeCount = Math.max(0, (c.likeCount || 1) - 1)
        }else{
            c.isLiked = true
            c.likeCount = (c.likeCount || 0) + 1
        }
    }catch(e){
        ElMessage.error('点赞失败')
    }
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
.like{
    display:flex;
    align-items:center;
    gap:8px;
    color:#fff;
}
.like .el-icon{
    color: #bbb;
}
.like.liked .el-icon{
    color: #f6a900;
}
.like.liked .like-count{
    color:#f6a900;
}
.comments{
    margin-top:30px;
}
.comment-list{
    margin-top:12px;
    display:flex;
    flex-direction:column;
    gap:12px;
}
.comment-item{
    padding:12px;
    background:#fafafa;
    border-radius:8px;
}
.comment-user{
    font-weight:600;
    margin-bottom:6px;
}
.comment-content{
    color:#444;
}
.comment-time{
    margin-top:8px;
    color:#999;
    font-size:12px;
}
.comment-form{
    margin-top:16px;
}
.comment-actions{
    margin-top:8px;
    display:flex;
    align-items:center;
    gap:8px;
}
.like-btn{
    display:inline-flex;
    align-items:center;
    gap:4px;
    cursor:pointer;
    color:#bbb;
    user-select:none;
}
.like-btn.liked{
    color:#f6a900;
}
.like-btn .like-count{
    font-size:13px;
    color:inherit;
}
.reply-box{
    margin-top:8px;
}
.replies{
    margin-top:10px;
    padding-left:12px;
    border-left:2px solid #f0f0f0;
    display:flex;
    flex-direction:column;
    gap:8px;
}
.reply-item{
    padding:8px;
    background:#fff;
    border-radius:6px;
}
</style>