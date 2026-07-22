import { defineStore } from "pinia";

export const useUserStore = defineStore(
    "user",
    {
        state: () => ({
            userId: localStorage.getItem("userId") || "",
            username: localStorage.getItem("username") || "",
            avatar: localStorage.getItem("avatar") || "",
            token: localStorage.getItem("token") || "",
            sex: localStorage.getItem("sex") || "",
            email: localStorage.getItem("email") || "",
            introduction: localStorage.getItem("introduction") || "",
            birth: localStorage.getItem("birth") || "",
            phoneNum: localStorage.getItem("phoneNum") || "",
            role: localStorage.getItem("role") || ""
        }),

        actions: {
            login(user) {
                this.userId = user.id;
                this.username = user.username || user.name;
                this.avatar = user.avatar || "";
                this.sex = user.sex || "";
                this.email = user.email || "";
                this.introduction = user.introduction || "";
                this.birth = user.birth || "";
                this.phoneNum = user.phoneNum || "";
                this.role = user.role || "user";

                localStorage.setItem("userId", user.id);
                localStorage.setItem("username", this.username);
                localStorage.setItem("avatar", this.avatar);
                localStorage.setItem("sex", this.sex);
                localStorage.setItem("email", this.email);
                localStorage.setItem("introduction", this.introduction);
                localStorage.setItem("birth", this.birth);
                localStorage.setItem("phoneNum", this.phoneNum);
                localStorage.setItem("token", "login");
                localStorage.setItem("role", this.role);
                this.token = "login";
            },

            logout() {
                this.userId = "";
                this.username = "";
                this.avatar = "";
                this.token = "";
                this.sex = "";
                this.email = "";
                this.introduction = "";
                this.birth = "";
                this.phoneNum = "";
                this.role = "";

                localStorage.removeItem("userId");
                localStorage.removeItem("username");
                localStorage.removeItem("avatar");
                localStorage.removeItem("token");
                localStorage.removeItem("sex");
                localStorage.removeItem("email");
                localStorage.removeItem("introduction");
                localStorage.removeItem("birth");
                localStorage.removeItem("phoneNum");
                localStorage.removeItem("role");
            },
            initUser() {
                this.userId = localStorage.getItem("userId") || "";
                this.username = localStorage.getItem("username") || "";
                this.avatar = localStorage.getItem("avatar") || "";
                this.token = localStorage.getItem("token") || "";
                this.sex = localStorage.getItem("sex") || "";
                this.email = localStorage.getItem("email") || "";
                this.introduction = localStorage.getItem("introduction") || "";
                this.birth = localStorage.getItem("birth") || "";
                this.phoneNum = localStorage.getItem("phoneNum") || "";
                this.role = localStorage.getItem("role") || "";
            },

            setAvatar(newAvatarUrl) {
                this.avatar = newAvatarUrl;
                localStorage.setItem("avatar", newAvatarUrl);
            },

            updateUserInfo(info) {
                if (info.username !== undefined) {
                    this.username = info.username;
                    localStorage.setItem("username", info.username);
                }
                if (info.sex !== undefined) {
                    this.sex = info.sex;
                    localStorage.setItem("sex", info.sex);
                }
                if (info.email !== undefined) {
                    this.email = info.email;
                    localStorage.setItem("email", info.email);
                }
                if (info.introduction !== undefined) {
                    this.introduction = info.introduction;
                    localStorage.setItem("introduction", info.introduction);
                }
                if (info.birth !== undefined) {
                    this.birth = info.birth;
                    localStorage.setItem("birth", info.birth);
                }
                if (info.phoneNum !== undefined) {
                    this.phoneNum = info.phoneNum;
                    localStorage.setItem("phoneNum", info.phoneNum);
                }
            }
        },
        getters: {
            isLogin(state) {
                return !!state.token;
            },
            isAdmin(state) {
                return state.role === 'admin';
            }
        }
    });
