<template>
    <v-container fluid>
        <v-card max-width="640" class="mx-auto">
            <v-card-title>Reset Password</v-card-title>
            <v-card-text>
                <v-text-field type="password" v-model="password" label="New Password" outlined dense></v-text-field>
                <v-text-field type="password" v-model="confirmPassword" label="Confirm Password" outlined dense></v-text-field>
                <v-btn :disabled="!isValid()" @click="submit" color="primary" elevation="0">save password</v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { ClientService } from '~/service'
export default {
    data: () => ({
        client: null,
        code: null,
        password: null,
        confirmPassword: null
    }),
    mounted() {
        this.client = new ClientService(this.$store)
        this.code = this.$route.params.code
        if (!this.code) this.$nuxt.error({ statusCode: 404 })
    },
    methods: {
        submit() {
            this.client.post("reset-password", { code: this.code, password: this.password }).then((response) => {
                this.$router.push("/login")
            }).catch((err) => {
                this.$nuxt.error({ statusCode: 401 })
            })
        },
        isValid() {
            if (!this.password) return false
            if (!this.password.trim().length) return false
            return this.password === this.confirmPassword
        }
    }
}
</script>
