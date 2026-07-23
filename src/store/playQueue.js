import { defineStore } from 'pinia'

export const usePlayQueue = defineStore('playQueue', {
  state: () => ({
    queue: [],
    currentIndex: -1
  }),
  getters: {
    currentSong(state) {
      if (state.currentIndex >= 0 && state.currentIndex < state.queue.length) {
        return state.queue[state.currentIndex]
      }
      return null
    },
    hasPrev(state) { return state.currentIndex > 0 },
    hasNext(state) { return state.currentIndex < state.queue.length - 1 }
  },
  actions: {
    playSong(song) {
      if (!song) return
      if (this.queue.length === 0) {
        this.queue = [song]
        this.currentIndex = 0
      } else {
        this.queue.push(song)
      }
      this._emit()
    },
    playAll(songs) {
      if (!songs || !songs.length) return
      this.queue = [...songs]
      this.currentIndex = 0
      this._emit()
    },
    playIndex(index) {
      if (index >= 0 && index < this.queue.length) {
        this.currentIndex = index
        this._emit()
      }
    },
    prev() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        this._emit()
      }
    },
    next() {
      if (this.currentIndex < this.queue.length - 1) {
        this.currentIndex++
        this._emit()
      }
    },
    removeFromQueue(index) {
      if (index < 0 || index >= this.queue.length) return
      this.queue.splice(index, 1)
      if (this.queue.length === 0) {
        this.currentIndex = -1
      } else if (index < this.currentIndex) {
        this.currentIndex--
      } else if (index === this.currentIndex) {
        if (this.currentIndex >= this.queue.length) {
          this.currentIndex = this.queue.length - 1
        }
        if (this.currentIndex >= 0) this._emit()
      }
    },
    clear() {
      this.queue = []
      this.currentIndex = -1
      window.dispatchEvent(new CustomEvent('play-song', { detail: null }))
    },
    _emit() {
      const s = this.currentSong
      if (s) {
        window.dispatchEvent(new CustomEvent('play-song', { detail: s }))
      }
    }
  }
})
