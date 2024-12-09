import { ref } from 'vue'
import { defineStore } from 'pinia'

export const session = defineStore('session', () => {
    let data = ref(null)

    function starSession(sessionData) {
        data.value = sessionData
    }

    function endSession() {
        data.value = null
    }

    return {
        data,
        starSession,
        endSession,
    }
})