import { api } from '@/utils/request'

export function adminLogin(data) {
  return api({ method: 'post', url: '/admin/login', data })
}

export function getAdminInfo() {
  return api({ url: '/admin/info' })
}

export function getAdminSongPage(page = 1, size = 10, status) {
  const url = status !== undefined ? `/admin/song/page?page=${page}&size=${size}&status=${status}` : `/admin/song/page?page=${page}&size=${size}`
  return api({ url })
}

export function auditSong(id, status, auditReason) {
  const url = `/admin/song/audit?id=${id}&status=${status}` + (auditReason !== undefined ? `&auditReason=${encodeURIComponent(auditReason)}` : '')
  return api({
    method: 'post',
    url
  })
}

export function adminDeleteSong(id) {
  return api({ url: `/admin/song/delete?id=${id}` })
}

export function getAdminSongDetail(id) {
  return api({ url: `/admin/song/detail?id=${id}` })
}

export function getAdminPostPage(page = 1, size = 10, status) {
  const url = status !== undefined ? `/admin/post/page?page=${page}&size=${size}&status=${status}` : `/admin/post/page?page=${page}&size=${size}`
  return api({ url })
}

export function auditPost(postId, status, auditReason) {
  const url = `/admin/post/audit?postId=${postId}&status=${status}` + (auditReason !== undefined ? `&auditReason=${encodeURIComponent(auditReason)}` : '')
  return api({
    method: 'post',
    url
  })
}

export function adminDeletePost(id) {
  return api({ url: `/admin/post/delete?id=${id}` })
}

export function getAdminPostDetail(postId) {
  return api({ url: `/admin/post/detail?postId=${postId}` })
}
