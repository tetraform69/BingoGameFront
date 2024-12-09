<script>
import { gameSocket } from '@/stores/gameSocket';
import { session } from '@/stores/sesion';
import { useBoardStore } from '@/stores/board';

export default {
    data() {
        return {
            state: null,
            socket: gameSocket(),
            session: session(),
            board: useBoardStore()
        }
    },
    mounted() {
        if (this.session.data == null) {
            this.$router.push({ name: 'login' })
        }
        this.socket.connect();

        this.socket.on('gameState', (state) => {
            this.state = state
        })

        this.socket.on('timeRemaining', (time) => {
            //console.log(time)
        })
    },
    methods: {
        joinGame() {
            this.socket.emit('joinGame', { username: this.session.data.username }, (res) => {
                if (res.ok) {
                    this.board.set(res.data)
                    this.$router.push({ name: 'game' })
                } else {
                    let message = res?.message ?? 'Error Unexpected'

                    this.$swal({
                        icon: 'error',
                        title: message
                    })
                }
            })
        },
    },
}
</script>

<template>
    <main>
        <button @click="joinGame()" class="button" style="max-width: 200px;">
            new game
        </button>
    </main>
</template>
