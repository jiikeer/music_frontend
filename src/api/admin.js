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

export function auditSong(data) {
  return api({
    method: 'post',
    url: '/admin/song/audit',
    data,
    config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  })
}

export function adminDeleteSong(id) {
  return api({ method: 'delete', url: `/admin/song/delete?id=${id}` })
}

export function getAdminSongDetail(id) {
  return api({ url: `/admin/song/detail?id=${id}` })
}

export function getAdminPostPage(page = 1, size = 10, status) {
  const url = status !== undefined ? `/admin/post/page?page=${page}&size=${size}&status=${status}` : `/admin/post/page?page=${page}&size=${size}`
  return api({ url })
}

export function auditPost(data) {
  return api({
    method: 'post',
    url: '/admin/post/audit',
    data,
    config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  })
}

export function adminDeletePost(postId) {
  return api({ method: 'delete', url: `/admin/post/delete?postId=${postId}` })
}

export function getAdminPostDetail(postId) {
  return api({ url: `/admin/post/detail?postId=${postId}` })
}
