<template>
    <v-card outlined>
        <v-card-title>
            <v-icon>mdi-eye</v-icon>
            Visitors
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="6" md="3">
                    <h1 class="text-body-2">
                        Mobile
                        <small class="d-block text-caption"> {{ count.mobile }} </small>
                    </h1>
                </v-col>
                <v-col cols="6" md="3">
                    <h1 class="text-body-2">
                        Tablet
                        <small class="d-block text-caption"> {{ count.tablet }} </small>
                    </h1>
                </v-col>
                <v-col cols="6" md="3">
                    <h1 class="text-body-2">
                        Desktop
                        <small class="d-block text-caption"> {{ count.desktop }} </small>
                    </h1>
                </v-col>
                <v-col cols="6" md="3">
                    <h1 class="text-body-2">
                        Unknown
                        <small class="d-block text-caption"> {{ count.unknown }} </small>
                    </h1>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
import { ClientService } from '~/service'

export default {
    data: () => ({
        client: null,
        count: {
            mobile: 0,
            tablet: 0,
            desktop: 0,
            unknown: 0
        }
    }),
    mounted() {
        this.client = new ClientService(this.$store)
        this.client.get("metrics","analytics").then(({ analytics }) => {
            this.count.mobile = analytics.reduce( (a, analytic) => a + Object.values(analytic.visits.devices.mobile || {}).map(v => v.unique).reduce((a, v) => a + v, 0), 0)
            this.count.tablet = analytics.reduce( (a, analytic) => a + Object.values(analytic.visits.devices.tablet || {}).map(v => v.unique).reduce((a, v) => a + v, 0), 0)
            this.count.desktop = analytics.reduce( (a, analytic) => a + Object.values(analytic.visits.devices.desktop || {}).map(v => v.unique).reduce((a, v) => a + v, 0), 0)
            this.count.unknown = analytics.reduce( (a, analytic) => a + Object.values(analytic.visits.devices.unknown || {}).map(v => v.unique).reduce((a, v) => a + v, 0), 0)
        })
    }
}
</script>
