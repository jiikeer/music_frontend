<template>
  <div class="favorite-page">
    <el-empty v-if="favoriteList.length===0" description="暂无收藏歌曲" />
    <div class="song-list" v-else>
      <div class="song-item" v-for="item in favoriteList" :key="item.id" @click="playSong(item)" style="cursor:pointer;">
        <el-image class="cover" :src="getCover(item.pic || item.cover)" fit="cover">
          <template #error><div class="cover-error">🎵</div></template>
        </el-image>
        <div class="song-info">
          <div class="song-name">{{ item.songName }}</div>
          <div class="artist">{{ item.artist }}</div>
          <div class="collect-time">收藏时间：{{ formatTime(item.createTime) }}</div>
        </div>
        <div class="operation">
          <el-button class="play-btn" @click.stop="playSong(item)">播放</el-button>
          <el-button class="cancel-btn" @click.stop="cancelCollect(item)">取消收藏</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { useUserStore } from "@/store/user"
import { getUserCollect, collectSong } from "@/api/song"
import { attachImageUrl } from "@/utils"

const userStore = useUserStore()
const favoriteList = ref([])

async function loadFavorite() {
  try {
    const res = await getUserCollect(userStore.userId)
    // res 已经是 data 对象
    const list = res?.data || res
    favoriteList.value = Array.isArray(list) ? list : []
    console.log('收藏列表:', favoriteList.value)
  } catch (error) {
    console.error("获取收藏失败", error)
    ElMessage.error("获取收藏失败")
  }
}

function getCover(url) { return attachImageUrl(url) }
function formatTime(time) { return time ? time.substring(0, 10) : "" }

function playSong(song) {
  window.dispatchEvent(new CustomEvent('play-song', { detail: {
    id: song.songId,
    name: song.songName,
    artist: song.artist,
    cover: getCover(song.pic || song.cover),
    url: attachImageUrl(song.url)
  }}))
}

async function cancelCollect(song) {
  try {
    await ElMessageBox.confirm("确定取消收藏吗？", "提示", {
      confirmButtonText: "确定", cancelButtonText: "取消"
    })
    await collectSong({ userId: userStore.userId, songId: song.songId })
    ElMessage.success("取消收藏成功")
    loadFavorite()
  } catch (e) { console.log(e) }
}

onMounted(() => { loadFavorite() })
</script>

<style scoped>
.favorite-page { color: #333; padding: 20px 0; }
.song-list { display: flex; flex-direction: column; gap: 12px; }
.song-item {
  height: 110px; background: #f9f9f9; border-radius: 12px;
  display: flex; align-items: center; padding: 15px 25px;
}
.cover { width: 80px; height: 80px; border-radius: 10px; }
.cover-error { width: 80px; height: 80px; display: flex; justify-content: center; align-items: center; background: #ddd; font-size: 30px; }
.song-info { margin-left: 25px; flex: 1; }
.song-name { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
.artist { color: #666; }
.collect-time { color: #999; font-size: 13px; margin-top: 6px; }
.operation { display: flex; gap: 12px; }
.play-btn { background: #333 !important; color: #fff !important; border: none !important; }
.play-btn:hover { background: #555 !important; }
.cancel-btn { background: #fff !important; border: 1px solid #ccc !important; color: #666 !important; }
.cancel-btn:hover { border-color: #999 !important; }
</style>
