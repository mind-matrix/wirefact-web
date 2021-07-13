<template>
    <v-row align-content="center" justify="center">
        <v-col cols="12">
            <v-card class="mx-auto" max-width="480">
                <v-card-title>Sign Up</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model="name" type="text" label="Name" outlined dense></v-text-field>

                        <v-text-field v-model="username" @change="checkUsernameValid" type="text" label="Username (optional)" outlined dense>
                            <template v-slot:append-outer>
                                <v-tooltip top max-width="400">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-on="on" v-bind="attrs">
                                            mdi-information
                                        </v-icon>
                                    </template>
                                    Your username must be unique and must be at least 4 characters long. If not entered, a random username will be assigned to you. At the moment we do not support modifying usernames.
                                </v-tooltip>
                            </template>
                            <template v-if="usernameIsValid !== null && username && username.length" v-slot:append>
                                <v-icon v-if="usernameIsValid" color="success">
                                    mdi-check
                                </v-icon>
                                <v-icon v-else color="red">
                                    mdi-close
                                </v-icon>
                            </template>
                        </v-text-field>

                        <v-text-field v-model="email" @change="checkEmailValid" type="email" label="Email" outlined dense>
                            <template v-if="emailIsValid !== null && email && email.length" v-slot:append>
                                <v-icon v-if="emailIsValid" color="success">
                                    mdi-check
                                </v-icon>
                                <v-icon v-else color="red">
                                    mdi-close
                                </v-icon>
                            </template>
                        </v-text-field>
                        
                        <v-divider class="py-3"></v-divider>

                        <v-text-field v-model="phone" @change="checkPhoneValid" type="phone" label="Phone (optional)" outlined dense>
                            <template v-if="phoneIsValid !== null && phone && phone.length" v-slot:append>
                                <v-icon v-if="phoneIsValid" color="success">
                                    mdi-check
                                </v-icon>
                                <v-icon v-else color="red">
                                    mdi-close
                                </v-icon>
                            </template>
                        </v-text-field>

                        <v-divider class="py-3"></v-divider>

                        <v-text-field v-model="password" :type="hidePassword ? 'password' : 'text'" :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="hidePassword = !hidePassword" label="Password" autocomplete="false" outlined dense></v-text-field>
                        <v-text-field v-model="confirmPassword" :type="hideConfirmPassword ? 'password' : 'text'" :append-icon="hideConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="hideConfirmPassword = !hideConfirmPassword" label="Confirm password" autocomplete="false" outlined dense></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pt-0">
                    <v-spacer></v-spacer>
                    <v-btn :disabled="!isValid()" @click="signup" elevation="0" color="primary">
                        sign up
                    </v-btn>
                </v-card-actions>
                <v-footer>
                    Already have an account? <a class="pl-2" href="/login">Sign in</a>
                </v-footer>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { ClientService } from '~/service'
import parsePhoneNumber from "libphonenumber-js"

export default {
    layout: "noauth",
    head: {
        title: "Register",
        meta: [
            { hid: 'og:url', property: 'og:url', content: 'https://wirefact.com/register' }
        ]
    },
    data: () => ({
        client: null,
        name: null,
        username: null,
        usernameIsValid: null,
        email: null,
        emailIsValid: null,
        phone: null,
        phoneIsValid: null,
        password: null,
        confirmPassword: null,
        hidePassword: true,
        hideConfirmPassword: true
    }),
    mounted() {
        this.client = new ClientService(this.$store)
    },
    methods: {
        signup() {
            let data = {
                name: this.name,
                email: this.email,
                password: this.password
            }
            if (this.username && this.usernameIsValid) {
                data.username = this.username
            }
            if (this.phone && this.phoneIsValid) {
                data.phone = this.phone
            }
            this.client.post("register", data).then((response) => {
                this.$router.push("/login")
            }).catch((err) => {
                console.log(err.response)
                this.$nuxt.$emit("notify", { message: err.response, color: "red" })
            })
        },
        isValid() {
            if (!this.password) return false
            if (!this.password.trim().length) return false
            if (this.password !== this.confirmPassword) return false
            if (!this.name || !this.name.trim().length) return false
            if (!this.email) return false
            if (this.usernameIsValid === false) return false
            if (!this.emailIsValid) return false
            if (this.phoneIsValid === false) return false
            return true
        },
        checkUsernameValid() {
            if (!this.username || !this.username.trim().length) {
                this.usernameIsValid = null
                return
            }
            this.username = this.username.trim()
            let username = this.username
            this.client.post("profile-exists", { username }).then(({ exists }) => {
                this.usernameIsValid = !exists
            }).catch((err) => {
                this.usernameIsValid = false
                console.log("E: ", err.message, err.response)
            })
        },
        checkEmailValid() {
            let email = this.email
            this.client.post("profile-exists", { email }).then(({ exists }) => {
                this.emailIsValid = !exists
            }).catch((err) => {
                this.emailIsValid = false
                console.log("E: ", err.message, err.response)
            })
        },
        checkPhoneValid() {
            if (!this.phone || !this.phone.trim().length) {
                this.phoneIsValid = null
                return
            }
            this.phone = this.phone.trim()
            let phoneNumber = parsePhoneNumber(this.phone, "IN")
            if (!phoneNumber || !phoneNumber.isValid()) {
                this.phoneIsValid = false
                return
            } else {
                this.phone = phoneNumber.number
            }
            let phone = this.phone
            this.client.post("profile-exists", { phone }).then(({ exists }) => {
                this.phoneIsValid = !exists
            }).catch((err) => {
                this.phoneIsValid = false
                console.log("E: ", err.message, err.response)
            })
        }
    }
}
</script>
