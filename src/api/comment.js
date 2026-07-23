import { api } from '@/utils/request'

export function getAllComment() {
  return api({ url: '/comment' })
}

export function getCommentPage(page = 1, size = 20) {
  return api({ url: `/comment/page?page=${page}&size=${size}` }
  )
}

export function deleteComment(id) {
  return api({ url: `/comment/delete?id=${id}` })
}

export function addComment(data) {
  return api({ method: 'post', url: '/comment/add', data })
}

/**
 * 获取用户点赞过的评论
 *
 * GET /comment/liked?userId=
 */
export function getUserLikedComments(userId) {
  return api({ url: '/comment/liked', params: { userId } })
}
