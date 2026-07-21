import { api } from '@/utils/request'

export function publishPost(data) {
  return api({
    method: 'post',
    url: '/post/publish',
    data,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  })
}

export function updatePost(data) {
  return api({
    method: 'post',
    url: '/post/update',
    data,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  })
}

export function deletePost(postId, loginUserId) {
  return api({ method: 'delete', url: `/post/delete?postId=${postId}&loginUserId=${loginUserId}` })
}

export function getPostDetail(postId) {
  return api({ url: `/post/detail?postId=${postId}` })
}

export function getPostPage(page = 1, size = 10) {
  return api({ url: `/post/page?page=${page}&size=${size}` })
}

export function getUserPostList(userId) {
  return api({ url: `/post/user/list?userId=${userId}` })
}

export function likePost(data) {
  return api({ method: 'post', url: '/post/like', data })
}

export function addPostComment(data) {
  return api({ method: 'post', url: '/post/comment/add', data })
}

export function deletePostComment(commentId, userId) {
  return api({ method: 'delete', url: `/post/comment/delete?commentId=${commentId}&userId=${userId}` })
}

export function getPostCommentList(postId) {
  return api({ url: `/post/comment/list?postId=${postId}` })
}
