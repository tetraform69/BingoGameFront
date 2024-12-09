import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBoardStore = defineStore('board', () => {
    const board = ref(null)

    function set(boardData) {
        board.value = boardData
    }

    function reset() {
        board.value = null
    }

    return { board, set, reset }
})
