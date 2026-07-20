import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userId: "",
    username: "",
    userPic: "",
  }),
  actions: {
    setUserId(userId) {
      this.userId = userId;
    },
    setUsername(username) {
      this.username = username;
    },
    setUserPic(userPic) {
      this.userPic = userPic;
    },
  },
});