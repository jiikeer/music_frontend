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
            <el-input v-model="songForm.artist" />
          </el-form-item>
          <el-form-item label="音频文件">
            <el-upload drag :auto-upload="false" :before-upload="beforeUploadAudio">
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div>拖拽或点击上传音频（mp3/wav）</div>
            </el-upload>
            <div v-if="songForm.audioFile" class="file-name">已选：{{ songForm.audioFile.name }}</div>
          </el-form-item>
          <el-form-item label="歌词文件">
            <el-upload drag :auto-upload="false" :before-upload="beforeUploadLyrics" accept=".lrc,.txt">
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div>拖拽或点击上传歌词（.lrc .txt）</div>
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
          <el-form-item>
            <el-button type="primary">发布帖子</el-button>
          </el-form-item>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const songForm = reactive({ name: '', artist: '', audioFile: null, lyricsFile: null })
const postForm = reactive({ title: '', content: '' })

function beforeUploadAudio(file) {
  songForm.audioFile = file
  return false
}

function beforeUploadLyrics(file) {
  songForm.lyricsFile = file
  return false
}

function submitSong() {
  if (!songForm.lyricsFile) {
    ElMessage.error('请上传歌词文件')
    return
  }
  // 后端上传逻辑在这里实现；当前先显示成功提示
  ElMessage.success('歌曲提交成功（模拟）')
  // 清空表单
  songForm.name = ''
  songForm.artist = ''
  songForm.audioFile = null
  songForm.lyricsFile = null
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
@media (max-width: 900px) {
  .upload-grid {
    grid-template-columns: 1fr;
  }
}
</style>