<script>
import { gameSocket } from '@/stores/gameSocket';
import { session } from '@/stores/sesion';
import { useBoardStore } from '@/stores/board';

export default {
    data() {
        return {
            socket: gameSocket(),
            session: session(),
            boardStore: useBoardStore(),
            timeRemaining: 60,
            state: null,
            players: [],
            numsSelected: [],
            actualNumber: null,
            drawNumbers: [],
            winner: null,
        }
    },
    computed: {
        boardNumbers() {
            return this.boardStore.board?.numbers ?? []
        },
        boardNumber() {
            return this.boardStore.board?.number ?? 0
        }
    },
    mounted() {
        
        this.socket.on('timeRemaining', (time) => {
            this.timeRemaining = time
        })
        
        this.socket.on('players', (players) => {
            this.players = players
        })
        
        this.socket.on('gameState', (state) => {
            this.state = state
        })
        
        this.socket.on('newNumber', (number) => {
            this.actualNumber = number
        })
        
        this.socket.on('drawNumbers', (numbers) => {
            this.drawNumbers = numbers
        })
        
        this.socket.on('winner', (data) => {
            this.winner = data
            let dialog = document.getElementById('dialogWinner')
            dialog.showModal()
        })

        this.socket.on('disqualified', (message) => {
            let alert = {
                icon: 'error',
                title: message
            }
            this.$swal(alert)
                .then(() => {
                    this.$router.push({ name: 'home' })
                })
        })

        this.socket.emit('getPlayers')
        this.socket.emit('getTime')
        this.socket.emit('getGameState')
    },
    unmounted() {
        this.socket.disconnect()
    },
    methods: {
        bingo() {
            let data = {
                boardId: this.boardStore.board._id,
                numsSelected: this.numsSelected,
            }

            this.socket.emit('checkWinner', data, (res) => {
                console.log(res)
            })
        },
        hasNum(array, number) {
            return array.findIndex(num => num == number) != -1
        },
        goHome() {
            this.$router.push({ name: 'home' })
        }
    },
}
</script>

<template>
    <div class="content">
        <div class="alert">
            <template v-if="timeRemaining > 0">
                The game start in: {{ timeRemaining }}s
            </template>
            <template v-else-if="state == 'Running'">
                Number: {{ actualNumber }}
            </template>
        </div>
        <div class="players">
            <h3>Players</h3>
            <ul>
                <li v-for="player in players">{{ player }}</li>
            </ul>
            <button class="button" @click="bingo" :disabled="state == 'Waiting'">bingo!</button>
        </div>
        <div class="board">
            <span class="boardNumber">Board #{{ boardNumber }}</span>
            <div class="numbers">
                <div class="rows" v-for="rows in boardNumbers">
                    <label class="number" v-for="num in rows">
                        {{ num ?? "0w0" }}
                        <input type="checkbox" v-model="numsSelected" :value="num" :disabled="state == 'Waiting'"
                            hidden>
                    </label>
                </div>
            </div>
        </div>
    </div>
    <dialog class="dialog" id="dialogWinner">
        <h1>{{ winner?.user }} has won</h1>
        <span class="boardNumber">Board #{{ winner?.board.number }}</span>
        <div class="numbers">
            <div class="rows" v-for="rows in winner?.board.numbers">
                <label class="number" v-for="num in rows">
                    {{ num ?? "0w0" }}
                    <input type="checkbox" :checked="hasNum(winner.board.numSelect, num)" hidden>
                </label>
            </div>
        </div>
        <button class="button" @click="goHome">go home</button>
    </dialog>
</template>

<style>
.content {
    width: 100%;
    height: auto;
    display: grid;
    grid-template-areas:
        "alert alert alert ."
        "board board board players";
    grid-template-rows: 4rem 1fr 3rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
}

.alert {
    grid-area: alert;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: xx-large;
    width: 100%;
    border-radius: 5px;
    background: rgb(27, 41, 54);
    box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.players {
    grid-area: players;
    display: grid;
    grid-template-rows: 2rem 1fr 3rem;
    gap: 5px;
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 5px;
    background: rgb(27, 41, 54);
    text-align: center;
    box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.players ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    max-height: 500px;
    gap: 5px;
    overflow: hidden;
    overflow-y: scroll;
    scrollbar-width: none;
}

.players li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 30px;
    border-radius: 5px;
    padding: 4px;
    background: rgb(22, 34, 44);
    overflow: hidden;
    box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.board {
    grid-area: board;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    padding: 15px 0;
    background: rgb(27, 41, 54);
    text-align: center;
    box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.numbers {
    background: rgb(22, 34, 44);
    display: flex;
    width: min-content;
    flex-direction: column;
    gap: 1rem;
    padding: 10px;
    border-radius: 5px;
}

.rows {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.number {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 75px;
    aspect-ratio: 1;
    font-size: x-large;
    cursor: pointer;
    border-radius: 50%;
    user-select: none;
    transition: background-color 100ms;

    &:has(input:checked) {
        background-color: hsla(160, 100%, 37%, 1);
        color: #202020;
    }

    &:has(input:disabled) {
        background-color: #202020;
        cursor: not-allowed;
    }
}

.dialog[open] {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: auto;
    border: none;
    border-radius: 5px;
    padding: 16px;
    color: var(--color-text);
    background: rgb(27, 41, 54);
    box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);

    & .numbers {
        pointer-events: none;
    }
}

.dialog::backdrop {
    background-color: #20202086;
}
</style>