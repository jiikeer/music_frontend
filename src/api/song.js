import request from "@/utils/request";
/**
 * 上传歌曲
 * 
 * POST /song/upload
 * multipart/form-data
 */
export function uploadSong(data){
    return request({
        url:"/song/upload",
        method:"POST",
        headers:{
            "Content-Type":"multipart/form-data"
        },
        data
    })
}
/**
 * 修改歌曲
 *
 * POST /song/update
 * multipart/form-data
 */
export function updateSong(data){
    return request({
        url:"/song/update",
        method:"POST",
        headers:{
            "Content-Type":"multipart/form-data"
        },
        data
    })
}
/**
 * 删除歌曲
 *
 * DELETE /song/delete?id=xx
 */
export function deleteSong(id){
    return request({
        url:"/song/delete",
        method:"DELETE",
        params:{
            id
        }
    })
}
/**
 * 查询用户上传歌曲
 *
 * GET /song/user?userId=xx
 */
export function getUserSongs(userId){
    return request({
        url:"/song/user",
        method:"GET",
        params:{
            userId
        }
    })
}
/**
 * 歌曲详情
 *
 * GET /song/detail?id=xx
 */
export function getSongDetail(id){
    return request({
        url:"/song/detail",
        method:"GET",
        params:{
            id
        }
    })
}
// ==================== 收藏 ====================
/**
 * 收藏/取消收藏歌曲
 *
 * POST /song/collect
 *
 * JSON:
 * {
 *   userId,
 *   songId
 * }
 */
export function collectSong(data){

    return request({

        url:"/song/collect",

        method:"POST",

        data
    })
}
/**
 * 查询用户收藏歌曲
 *
 * GET /song/collect/list?userId=xx
 */
export function getUserCollect(userId){
    return request({
        url:"/song/collect/list",
        method:"GET",
        params:{
            userId
        }
    })
}
// ==================== 评论 ====================
/**
 * 添加歌曲评论
 *
 * POST /song/comment/add
 */
export function addSongComment(data){
    return request({
        url:"/song/comment/add",
        method:"POST",
        data
    })
}
/**
 * 删除歌曲评论
 *
 * DELETE /song/comment/delete
 *
 * 参数:
 * commentId
 * userId
 */
export function deleteSongComment(
    commentId,
    userId
){
    return request({
        url:"/song/comment/delete",
        method:"DELETE",
        params:{
            commentId,
            userId
        }
    })
}
/**
 * 查询歌曲评论
 *
 * GET /song/comment/list?songId=xx
 */
export function getSongComments(songId){
    return request({
        url:"/song/comment/list",
        method:"GET",
        params:{
            songId
        }
    })
}