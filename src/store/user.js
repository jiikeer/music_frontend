import { defineStore } from "pinia";

export const useUserStore = defineStore(
"user",
{
    state:()=>({
        userId: localStorage.getItem("userId") || "",
        username: localStorage.getItem("username") || "",
        avatar: localStorage.getItem("avatar") || "",
        token: localStorage.getItem("token") || "",
        gender: localStorage.getItem("gender") || "",
        email: localStorage.getItem("email") || "",
        signature: localStorage.getItem("signature") || "",
        birth: localStorage.getItem("birth") || ""
    }),

    actions:{
        // 登录保存用户基础信息
        login(user){
            this.userId = user.id;
            this.username = user.username;
            this.avatar = user.avatar || "";
            this.gender = user.gender || "";
            this.email = user.email || "";
            this.signature = user.signature || "";
            this.birth = user.birth || "";

            localStorage.setItem("userId", user.id);
            localStorage.setItem("username", user.username);
            localStorage.setItem("avatar", user.avatar || "");
            localStorage.setItem("gender", user.gender || "");
            localStorage.setItem("email", user.email || "");
            localStorage.setItem("signature", user.signature || "");
            localStorage.setItem("birth", user.birth || "");
            localStorage.setItem("token", "login");
            this.token = "login";
        },

        // 退出登录，清空全部本地存储
        logout(){
            this.userId = "";
            this.username = "";
            this.avatar = "";
            this.token = "";
            this.gender = "";
            this.email = "";
            this.signature = "";
            this.birth = "";

            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            localStorage.removeItem("avatar");
            localStorage.removeItem("token");
            localStorage.removeItem("gender");
            localStorage.removeItem("email");
            localStorage.removeItem("signature");
            localStorage.removeItem("birth");
        },
        initUser(){
            this.userId = localStorage.getItem("userId") || "";
            this.username = localStorage.getItem("username") || "";
            this.avatar = localStorage.getItem("avatar") || "";
            this.token = localStorage.getItem("token") || "";
            this.gender = localStorage.getItem("gender") || "";
            this.email = localStorage.getItem("email") || "";
            this.signature = localStorage.getItem("signature") || "";
            this.birth = localStorage.getItem("birth") || "";
        },

        setAvatar(newAvatarUrl){
            this.avatar = newAvatarUrl;
            localStorage.setItem("avatar", newAvatarUrl);
        },

        updateUserInfo(info){
            if(info.username !== undefined){
                this.username = info.username;
                localStorage.setItem("username", info.username);
            }
            if(info.gender !== undefined){
                this.gender = info.gender;
                localStorage.setItem("gender", info.gender);
            }
            if(info.email !== undefined){
                this.email = info.email;
                localStorage.setItem("email", info.email);
            }
            if(info.signature !== undefined){
                this.signature = info.signature;
                localStorage.setItem("signature", info.signature);
            }
            if(info.birth !== undefined){
                this.birth = info.birth;
                localStorage.setItem("birth", info.birth);
            }
        }
    },
    getters:{
        isLogin(state){
            return !!state.token;
        }
    }
});