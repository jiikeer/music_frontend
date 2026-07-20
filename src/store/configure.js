import { defineStore } from "pinia";

export const useConfigureStore = defineStore("configure", {
  state: () => ({
    token: false,
    showAside: false,
    showSongCommentDialog: false,
    activeNavName: "首页",
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    setActiveNavName(activeNavName) {
      this.activeNavName = activeNavName;
    },
    setShowAside(showAside) {
      this.showAside = showAside;
    },
    setShowSongCommentDialog(showSongCommentDialog) {
      this.showSongCommentDialog = showSongCommentDialog;
    },
  },
});