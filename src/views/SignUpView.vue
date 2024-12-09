<script>

export default {
    data() {
        return {
            username: '',
            email: '',
            password: '',
        }
    },
    methods: {
        async signup() {
            let url = 'users'

            let data = {
                username: this.username,
                email: this.email,
                password: this.password,
            }

            let alert

            try {
                let response = await this.$peticion(url, 'POST', data)

                if (response) {
                    alert = {
                        icon: 'success',
                        title: 'User created successfully'
                    }
                }
            } catch {
                alert = {
                    icon: 'error',
                    title: 'Something went wrong!'
                }
            }

            this.$swal(alert)
                .then(() => {
                    this.$router.push({ name: 'login' })
                })
        },
    },
}
</script>

<template>
    <div class="content">
        <form @submit.prevent="signup()">
            <label for="username">
                Username
            </label>
            <input v-model="username" type="text" name="username" id="username" tabindex="1" required>
            <label for="email">
                Email
            </label>
            <input v-model="email" type="email" name="email" id="email" tabindex="2" required>
            <label for="password">
                Password
            </label>
            <input v-model="password" type="text" name="password" id="password" tabindex="3" required>
            <div>
                <router-link to="/login" tabindex="5">I have account</router-link>
            </div>
            <button type="submit" tabindex="4">Sign Up</button>
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
    border: 5px solid transparent;
    outline: none;
    border-radius: 30px;
    padding: 15px 5px;
    font-size: 1rem;
    transition: background-color border 500ms;
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