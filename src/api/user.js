import { api } from "@/utils/request";


// =====================
// 用户注册
// POST /user/add
// =====================
export function register(data){
    return api({
        method:"post",
        url:"/user/add",
        data:data
    });
}

// =====================
// 用户登录
// POST /user/login
// =====================
export function login(data){
return api({
    method:"post",
    url:"/user/login",
    data:data
});

}

// =====================
// 查询所有用户
// GET /user
// =====================
export function getAllUser(){
    return api({
        url:"/user"
    });
}

// =====================
// 用户分页
// GET /user/page
// =====================
export function getUserPage(page=1,size=20){
    return api({
        url:`/user/page?page=${page}&size=${size}`
    });
}

// =====================
// 查询用户详情
// GET /user/detail?id=
// =====================
export function getUserDetail(id){
    return api({
        url:`/user/detail?id=${id}`
    });
}

// =====================
// 删除用户
// GET /user/delete?id=
// =====================
export function deleteUser(id){
    return api({
        method:"delete",
        url:`/user/delete?id=${id}`
    });
}

// =====================
// 修改用户信息
// POST /user/update
// =====================
export function updateUser(data){
    return api({
        method:"post",
        url:"/user/update",
        data:data
    });
}

// =====================
// 修改密码
// POST /user/updatePassword
// =====================
export function updatePasswordApi(data){
    return api({
        method:"post",
        url:"/user/updatePassword",
        data:data
    });
}

// =====================
// 上传头像
// POST /user/avatar/update
// Multipart
// =====================
export function uploadAvatar(id,file){
    let formData=new FormData();
    formData.append(
        "file",
        file
    );
    return api({
        method:"post",
        url:`/user/avatar/update?id=${id}`,
        data:formData,
        config:{
            headers:{
                "Content-Type":
                "multipart/form-data"
            }
        }
    });
}
