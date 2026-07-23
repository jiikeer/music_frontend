<template>
  <div class="upload-page">
    <div class="page-title">上传你的作品</div>
    <div class="upload-grid">
      <section class="panel">
        <h3>上传歌曲</h3>
        <el-form label-width="80px">
          <el-form-item label="歌曲名">
            <el-input v-model="songForm.name" />
          </el-form-item>
          <el-form-item label="歌手">
            <el-input
              v-model="songForm.artist"
              :disabled="!isAdmin"
              :style="isAdmin ? {} : { backgroundColor: '#f5f5f5' }"
            />
            <span v-if="!isAdmin" style="font-size:12px;color:#999;">歌手已默认设置为您的用户名</span>
          </el-form-item>
          <el-form-item label="封面图">
            <el-upload
              drag
              :auto-upload="false"
              :on-change="handleCoverChange"
              :show-file-list="false"
              accept="image/*"
              :limit="1"
            >
      <span
        class="cover-default"
        v-if="!songForm.coverUrl"
        style="flex-direction:row;align-items:center;gap:6px;display:flex;"
      >
        <el-icon><UploadFilled /></el-icon>
        <span>点击或拖拽上传封面</span>
      </span>
      <img
        v-else
        :src="songForm.coverUrl"
        class="cover-preview"
        style="width:100%;height:180px;object-fit:cover;border-radius:12px;"
      />
            </el-upload>
            <div v-if="songForm.coverFile" class="file-name">已选：{{ songForm.coverFile.name }}</div>
          </el-form-item>
          <el-form-item label="音频文件">
            <el-upload drag :auto-upload="false" :on-change="handleAudioChange" :show-file-list="false" accept=".mp3,.wav,audio/*" :limit="1">
              <div v-if="songForm.audioFile">
                <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                <div>{{ songForm.audioFile.name }}</div>
              </div>
              <div v-else>
                <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                <div>拖拽或点击上传音频（mp3/wav）</div>
              </div>
            </el-upload>
            <div v-if="songForm.audioFile" class="file-name">已选：{{ songForm.audioFile.name }}</div>
          </el-form-item>
          <el-form-item label="歌词文件">
            <el-upload drag :auto-upload="false" :on-change="handleLyricsChange" accept=".lrc,.txt,text/plain" :show-file-list="false" :limit="1">
              <div v-if="songForm.lyricsFile">
                <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                <div>{{ songForm.lyricsFile.name }}</div>
              </div>
              <div v-else>
                <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                <div>拖拽或点击上传歌词（.lrc .txt）</div>
              </div>
            </el-upload>
            <div v-if="songForm.lyricsFile" class="file-name">已选：{{ songForm.lyricsFile.name }}</div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitSong">提交歌曲</el-button>
          </el-form-item>
        </el-form>
      </section>
      <section class="panel">
        <h3>发布帖子</h3>
        <el-form label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="postForm.title" />
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="postForm.content" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="封面图">
            <el-upload
              drag
              :auto-upload="false"
              :on-change="handlePostCoverChange"
              :show-file-list="false"
              accept="image/*"
              :limit="1"
            >
              <span
                class="cover-default"
                v-if="!postForm.coverUrl"
                style="flex-direction:row;align-items:center;gap:6px;display:flex;"
              >
                <el-icon><UploadFilled /></el-icon>
                <span>点击或拖拽上传封面</span>
              </span>
              <img
                v-else
                :src="postForm.coverUrl"
                class="cover-preview"
                style="width:100%;height:180px;object-fit:cover;border-radius:12px;"
              />
            </el-upload>
            <div v-if="postForm.coverFile" class="file-name">已选：{{ postForm.coverFile.name }}</div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitPost">发布帖子</el-button>
          </el-form-item>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.isAdmin)
const songForm = reactive({ name: '', artist: '', audioFile: null, lyricsFile: null, coverFile: null, coverUrl: '' })
const postForm = reactive({ title: '', content: '', coverFile: null, coverUrl: '' })

// 页面加载时自动填充歌手为当前用户名
onMounted(() => {
  if (!isAdmin.value && userStore.username) {
    songForm.artist = userStore.username
  }
})

function handleAudioChange(uploadFile) {
  const file = uploadFile.raw
  if (!file) { ElMessage.error('无法读取音频文件'); return }
  songForm.audioFile = file
}

function handleLyricsChange(uploadFile) {
  const file = uploadFile.raw
  if (!file) { ElMessage.error('无法读取歌词文件'); return }
  songForm.lyricsFile = file
}

function handleCoverChange(uploadFile) {
  const file = uploadFile.raw
  if (!file) { ElMessage.error('无法读取封面文件'); return }
  if (songForm.coverUrl?.startsWith('blob:')) { URL.revokeObjectURL(songForm.coverUrl) }
  songForm.coverFile = file
  songForm.coverUrl = URL.createObjectURL(file)
}

function handlePostCoverChange(uploadFile) {
  const file = uploadFile.raw
  if (!file) { ElMessage.error('无法读取封面文件'); return }
  if (postForm.coverUrl?.startsWith('blob:')) { URL.revokeObjectURL(postForm.coverUrl) }
  postForm.coverFile = file
  postForm.coverUrl = URL.createObjectURL(file)
}

async function submitSong() {
  if (!songForm.name?.trim()) { ElMessage.error('请输入歌曲名'); return }
  if (!songForm.audioFile) { ElMessage.error('请上传音频文件'); return }

  const formData = new FormData()
  formData.append('userId', userStore.userId)
  formData.append('name', songForm.name.trim())
  formData.append('introduction', songForm.artist?.trim() || '')
  formData.append('singer', songForm.artist?.trim() || '')
  formData.append('songFile', songForm.audioFile, songForm.audioFile.name)

  if (songForm.lyricsFile) {
    const lyricText = await songForm.lyricsFile.text()
    formData.append('lyrics', lyricText)
  }

  if (songForm.coverFile) {
    formData.append('coverFile', songForm.coverFile, songForm.coverFile.name)
  }

  try {
    await request.post('/song/upload', formData)
    ElMessage.success('歌曲提交成功，等待管理员审核')
    songForm.name = ''
    songForm.artist = ''
    songForm.audioFile = null
    songForm.lyricsFile = null
    songForm.coverFile = null
    songForm.coverUrl = ''
  } catch (e) {
    ElMessage.error('上传失败：' + (e.response?.data?.message || e.message))
  }
}

async function submitPost() {
  if (!postForm.title?.trim()) { ElMessage.error('请输入标题'); return }
  if (!postForm.content?.trim()) { ElMessage.error('请输入内容'); return }

  const formData = new FormData()
  formData.append('userId', userStore.userId)
  formData.append('title', postForm.title.trim())
  formData.append('content', postForm.content.trim())

  if (postForm.coverFile) {
    formData.append('coverFile', postForm.coverFile, postForm.coverFile.name)
  }

  try {
    await request.post('/post/publish', formData)
    ElMessage.success('帖子发布成功，等待管理员审核')
    postForm.title = ''
    postForm.content = ''
    postForm.coverFile = null
    postForm.coverUrl = ''
  } catch (e) {
    ElMessage.error('发布失败：' + (e.response?.data?.message || e.message))
  }
}
</script>

<style scoped>
.upload-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.page-title {
  font-size: 24px;
  font-weight: 700;
}
.upload-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.cover-preview {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}
.file-name {
  margin-top: 6px;
  font-size: 13px;
  color: #666;
}
@media (max-width: 900px) {
  .upload-grid {
    grid-template-columns: 1fr;
  }
}
</style>