<script>

import { session } from '@/stores/sesion';

export default {
    data() {
        return {
            username: '',
            password: '',
            session: session(),
        }
    },
    methods: {
        async login() {
            let url = 'auth'

            let data = {
                username: this.username,
                password: this.password,
            }

            let alert

            try {
                let response = await this.$peticion(url, 'POST', data);

                if (response) {

                    let sesion = {
                        username: this.username,
                        token: response.access_token,
                    }

                    this.session.starSession(sesion)

                    alert = {
                        icon: 'success',
                        title: 'Login successfully'
                    }
                }

                this.$swal(alert)
                    .then(() => {
                        this.$router.push({ name: 'home' })
                    })
            } catch (err) {

                let message = err?.data?.message ?? 'Error Unexpected'

                alert = {
                    icon: 'error',
                    title: message
                }

                this.$swal(alert)
            }

        },
    },
}
</script>

<template>
    <div class="content">
        <form @submit.prevent="login()">
            <label for="username">
                Username
            </label>
            <input v-model="username" type="text" name="username" id="username" required tabindex="1">
            <label for="password">
                Password
            </label>
            <input v-model="password" type="password" name="password" id="password" required tabindex="2">
            <div>
                <router-link to="/signup" tabindex="4">Don't have an account?</router-link>
            </div>
            <button type="submit" tabindex="3">Login</button>
        </form>
    </div>
</template>

<style scoped>
.content {
    width: 100%;
    max-width: 700px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #13232f;
    padding: 50px 40px;
}

form {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    gap: 1rem;
    max-width: 500px;
}

input {
    font-size: 1.25rem;
    accent-color: #00000081;
    color: #fff;
    outline: none;
    width: 100%;
    padding: 5px 10px;
    background: none;
    border-radius: 5px;
    border: 1px solid #00000081;
}

button {
    text-transform: uppercase;
    align-self: center;
    font-weight: 600;
    cursor: pointer;
    background-color: hsla(160, 100%, 37%, 1);
    border: 0;
    outline: none;
    border-radius: 25px;
    padding: 15px 5px;
    font-size: 1rem;
    transition: background-color 500ms;
    max-width: 150px;
    width: 100%;

    &:hover {
        background-color: hsla(160, 100%, 37%, 0.2);
    }
}

a {
    text-decoration: underline;
}
</style>