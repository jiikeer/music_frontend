import { api } from '@/utils/request'

export function uploadSong(data) {
  return api({
    method: 'post',
    url: '/song/upload',
    data,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  })
}

export function updateSong(data) {
  return api({
    method: 'post',
    url: '/song/update',
    data,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  })
}

export function deleteSong(id) {
  return api({ method: 'delete', url: `/song/delete?id=${id}` })
}

// admin 用
export function getSongByUser(userId) {
  return api({ url: `/song/user?userId=${userId}` })
}

// master 用户页面用（兼容旧函数名）
export function getUserSongs(userId) {
  return getSongByUser(userId)
}

export function getSongDetail(id) {
  return api({ url: `/song/detail?id=${id}` })
}

export function collectSong(data) {
  return api({ method: 'post', url: '/song/collect', data })
}

// admin 用
export function getCollectList(userId) {
  return api({ url: `/song/collect/list?userId=${userId}` })
}

// master 用户页面用（兼容旧函数名）
export function getUserCollect(userId) {
  return getCollectList(userId)
}

export function addSongComment(data) {
  return api({ method: 'post', url: '/song/comment/add', data })
}

export function deleteSongComment(commentId, userId) {
  return api({ method: 'delete', url: `/song/comment/delete?commentId=${commentId}&userId=${userId}` })
}

export function getSongCommentList(songId) {
  return api({ url: `/song/comment/list?songId=${songId}` })
}

// 兼容 master 旧函数名
export function getSongComments(songId) {
  return getSongCommentList(songId)
}
