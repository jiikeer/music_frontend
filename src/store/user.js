import { defineStore } from "pinia";

export const useUserStore = defineStore(
"user",
{
    state:()=>({
        userId:
        localStorage.getItem("userId") || "",
        username:
        localStorage.getItem("username") || "",
        avatar:
        localStorage.getItem("avatar") || "",
        token:
        localStorage.getItem("token") || ""
    }),

    actions:{
        // 登录保存
        login(user){
            this.userId=user.id;
            this.username=user.username;
            this.avatar=user.avatar;
            localStorage.setItem(
                "userId",
                user.id
            );
            localStorage.setItem(
                "username",
                user.username
            );
            localStorage.setItem(
                "avatar",
                user.avatar || ""
            );
            localStorage.setItem(
                "token",
                "login"
            );
            this.token="login";
        },
        //退出登录
        logout(){
            this.userId="";
            this.username="";
            this.avatar="";
            this.token="";

            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            localStorage.removeItem("avatar");
            localStorage.removeItem("token");
        },
        initUser(){
            this.userId =
            localStorage.getItem("userId") || "";
            this.username =
            localStorage.getItem("username") || "";
            this.avatar =
            localStorage.getItem("avatar") || "";
            this.token =
            localStorage.getItem("token") || "";
        }
    },
    getters:{
        isLogin(state){
            return !!state.token;
        }
    }
});