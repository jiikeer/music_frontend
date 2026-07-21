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

export function getSongByUser(userId) {
  return api({ url: `/song/user?userId=${userId}` })
}

export function getSongDetail(id) {
  return api({ url: `/song/detail?id=${id}` })
}

export function collectSong(data) {
  return api({ method: 'post', url: '/song/collect', data })
}

export function getCollectList(userId) {
  return api({ url: `/song/collect/list?userId=${userId}` })
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
