import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { ref } from 'vue'

export const gameSocket = defineStore('websocket', () => {
    let socket = ref(null)

    function connect() {
        if (socket.value == null) {
            socket.value = io(import.meta.env.VITE_BACK_HOST + 'game', {
                transports: ['websocket'], // Forzar transporte WebSocket
                withCredentials: true, // Si usas cookies o credenciales
            })

            socket.value.on('disconnect', () => {
                socket = ref(null)
            })
        }
    }

    function disconnect() {
        if (socket.value != null) {
            socket.value.disconnect();
            socket = ref(null);
        }
    }

    function on(event, fn) {
        if (socket.value != null) {
            socket.value.on(event, fn)
        }
    }

    function emit(event, data, fn) {
        if (socket.value != null) {
            socket.value.emit(event, data, fn)
        }
    }

    return {
        socket,
        on,
        emit,
        connect,
        disconnect,
    }
})

