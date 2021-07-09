<template>
    <v-container fluid>
        <v-row justify="center" class="text-center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <w-accounts></w-accounts>
            </v-col>
            <v-col cols="12" sm="8" md="6" lg="4">
                <w-visitor-analytics></w-visitor-analytics>
            </v-col>
        </v-row>
        <v-row dense justify="center" class="text-center">
            <v-col cols="12">
                <v-btn outlined link to="/invitation" text>
                    send invitation
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ClientService } from '~/service'
import WAccounts from "~/components/Metrics/WAccounts.vue"
import WVisitorAnalytics from "~/components/Metrics/WVisitorAnalytics.vue"

export default {
    layout: "auth",
    components: {
        WAccounts,
        WVisitorAnalytics
    },
    data: () => ({
        client: null
    }),
    mounted() {
        this.client = new ClientService(this.$store)
    }
}
</script>
