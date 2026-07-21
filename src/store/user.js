import { defineStore } from "pinia";

export const useUserStore = defineStore(
    "user",
    {
        state: () => ({
            userId: localStorage.getItem("userId") || "",
            username: localStorage.getItem("username") || "",
            avatar: localStorage.getItem("avatar") || "",
            token: localStorage.getItem("token") || "",
            role: localStorage.getItem("role") || ""
        }),

        actions: {
            login(user) {
                this.userId = user.id;
                this.username = user.username || user.name;
                this.avatar = user.avatar || "";
                this.role = user.role || "user";
                this.token = "login";
                localStorage.setItem("userId", user.id);
                localStorage.setItem("username", this.username);
                localStorage.setItem("avatar", this.avatar);
                localStorage.setItem("token", "login");
                localStorage.setItem("role", this.role);
            },
            logout() {
                this.userId = "";
                this.username = "";
                this.avatar = "";
                this.token = "";
                this.role = "";
                localStorage.removeItem("userId");
                localStorage.removeItem("username");
                localStorage.removeItem("avatar");
                localStorage.removeItem("token");
                localStorage.removeItem("role");
            },
            initUser() {
                this.userId = localStorage.getItem("userId") || "";
                this.username = localStorage.getItem("username") || "";
                this.avatar = localStorage.getItem("avatar") || "";
                this.token = localStorage.getItem("token") || "";
                this.role = localStorage.getItem("role") || "";
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
