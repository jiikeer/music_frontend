import {defineStore} from "pinia";

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
    /**
     * 登录保存
     */
    login(user){
        this.userId=user.id;
        this.username=user.username;
        this.avatar=user.avatar;
        //保存localStorage
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
            user.avatar
        );
        localStorage.setItem(
            "token",
            "login"
        );
    },
    /**
     *退出
     */
    logout(){
        this.userId="";
        this.username="";
        this.avatar="";
        this.token="";
        localStorage.clear();
    }
},
getters:{
    isLogin(state){
        return !!state.token;
    }
}
})