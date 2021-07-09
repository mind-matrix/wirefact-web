<template>
    <v-row align-content="center" justify="center">
        <v-col cols="12">
            <v-card class="mx-auto" max-width="480">
                <v-card-title>Sign In</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model="identifier" type="text" label="Username or Email" outlined dense></v-text-field>
                        <v-text-field v-model="password" :type="hidePassword ? 'password' : 'text'" :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="hidePassword = !hidePassword" label="Password" autocomplete="false" outlined dense></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pt-0">
                    <v-spacer></v-spacer>
                    <v-btn @click="signin" elevation="0" color="primary">
                        sign in
                    </v-btn>
                </v-card-actions>
                <v-footer>
                    <p class="my-0">Forgot password? <a class="pl-2" href="/reset-password">Reset your password</a></p>
                    <p class="my-0">No account? <a class="pl-2" href="/register">Create an account</a></p>
                </v-footer>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { ClientService } from '~/service'
export default {
    layout: "noauth",
    head: {
        title: "Login"
    },
    data: () => ({
        identifier: null,
        password: null,
        client: null,
        hidePassword: true
    }),
    async mounted() {
        this.client = new ClientService(this.$store)
    },
    methods: {
        signin() {
            this.client.post("login", { identifier: this.identifier, password: this.password }).then(({ user, token }) => {
                this.$store.commit("auth", { user, token })
                this.$router.push("/")
                console.log(this.$store.state)
            }).catch((err) => {
                if (err.response && err.response.status !== 500)
                    this.$nuxt.$emit("notify", { message: "Invalid email/username and/or password", color: "red" })
                else
                    this.$nuxt.$emit("notify", { message: "Probably invalid email/username and/or password 🤕", color: "red" })
            })
        }
    }
}
</script>
