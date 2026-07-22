import request from "@/utils/request";
// ====================== 帖子 ======================
/**
 * 发布帖子
 *
 * POST /post/publish
 *
 * 类型:
 * multipart/form-data
 *
 * 参数:
 * userId
 * title
 * content
 * coverFile
 */
export function publishPost(data){
    return request({
        url:"/post/publish",
        method:"POST",
        data
    })
}
/**
 * 修改帖子
 *
 * POST /post/update
 *
 * 参数:
 * id
 * title
 * content
 * coverFile
 */
export function updatePost(data){
    return request({
        url:"/post/update",
        method:"POST",
        data
    })
}
/**
 * 删除帖子
 *
 * DELETE /post/delete
 *
 * 参数:
 * postId
 * loginUserId
 */
export function deletePost(
    postId,
    loginUserId
){
    return request({
        url:"/post/delete",
        method:"DELETE",
        params:{
            postId,
            loginUserId
        }
    })
}
/**
 * 帖子详情
 *
 * GET /post/detail?postId=
 */
export function getPostDetail(postId){
    return request({
        url:"/post/detail",
        method:"GET",
        params:{
            postId
        }
    })
}
/**
 * 帖子分页
 *
 * GET /post/page?page=1&size=20
 */
export function getPostPage(
    page=1,
    size=20
){
    return request({
        url:"/post/page",
        method:"GET",
        params:{
            page,
            size
        }
    })
}
/**
 * 查询用户帖子
 *
 * GET /post/user/list?userId=
 */
export function getUserPosts(userId){
    return request({
        url:"/post/user/list",
        method:"GET",
        params:{
            userId
        }
    })
}
// ====================== 点赞 ======================
/**
 * 点赞/取消点赞
 *
 * POST /post/like
 *
 * JSON:
 *
 * {
 *   userId,
 *   postId
 * }
 */
export function likePost(data){
    return request({
        url:"/post/like",
        method:"POST",
        data
    })
}
// ====================== 评论 ======================
/**
 * 添加帖子评论
 *
 * POST /post/comment/add
 */
export function addPostComment(data){
    return request({
        url:"/post/comment/add",
        method:"POST",
        data
    })
}
/**
 * 删除帖子评论
 *
 * DELETE /post/comment/delete
 *
 * 参数:
 * commentId
 * userId
 */
export function deletePostComment(
    commentId,
    userId
){
    return request({
        url:"/post/comment/delete",
        method:"DELETE",
        params:{
            commentId,
            userId
        }
    })
}
/**
 * 查询帖子评论
 *
 * GET /post/comment/list?postId=
 */
export function getPostComments(postId){
    return request({
        url:"/post/comment/list",
        method:"GET",
        params:{
            postId
        }
    })

}