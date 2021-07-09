<template>
    <v-container fluid>
        <v-card max-width="500" class="mx-auto">
            <v-card-title>Send Invitation</v-card-title>
            <v-card-text>
                <v-form>
                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field v-model="name" label="Name" outlined dense prepend-icon="mdi-account"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="username" label="Username" outlined dense prepend-icon="mdi-account"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="email" label="Email" outlined dense prepend-icon="mdi-mail"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="phone" label="Phone" outlined dense prepend-icon="mdi-phone"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <header class="text-body-1">Role</header>
                            <v-btn-toggle
                                v-model="role"
                                color="primary"
                                mandatory
                            >
                                <v-btn v-for="(id, role) in roles" :key="id" :value="id">
                                    {{ role }}
                                </v-btn>
                            </v-btn-toggle>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn elevation="0" color="primary" @click="submit">
                    <v-icon small class="mr-1">mdi-send</v-icon>
                    send
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-snackbar color="transparent" v-model="notify" :timeout="3000" elevation="0" top left>
            <v-alert :color="notifyColor">
                {{ notifyText }}
            </v-alert>
        </v-snackbar>
    </v-container>
</template>

<script>
import { UserRole } from '~/assets/roles'
import { ClientService } from '~/service'
export default {
    data: () => ({
        client: null,
        name: null,
        username: null,
        email: null,
        phone: null,
        role: 0,
        notify: false,
        notifyText: null,
        notifyColor: "amber"
    }),
    computed: {
        roles() {
            return UserRole
        }
    },
    mounted() {
        this.client = new ClientService(this.$store)
    },
    methods: {
        submit() {
            let data = {
                name: this.name,
                username: this.username,
                email: this.email,
                phone: this.phone,
                role: this.role
            }
            this.client.post("invitation", data).then((response) => {
                this.notifyText = `Invitation has been sent to ${this.email} 🎉`
                this.notifyColor = "amber"
                this.notify = true
                this.reset()
            }).catch((err) => {
                this.notifyText = `There was a problem sending the invitation to ${this.email} 🤕`
                this.notifyColor = "red"
                this.notify = true
                console.log("E: ", err.message, err.response)
            })
        },
        reset() {
            this.name = null
            this.username = null
            this.email = null
            this.phone = null
            this.role = 0
        }
    }
}
</script>
