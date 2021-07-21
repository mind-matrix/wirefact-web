<template>
    <v-container fluid>
        <template v-if="!page">
            <v-container class="text-center" fluid>
                <v-progress-circular indeterminate></v-progress-circular>
            </v-container>
        </template>
        <div v-html="page"></div>
    </v-container>
</template>

<script>
import { LEGAL } from "~/assets/doc"

export default {
    async asyncData({ route }) {
        const { section } = route.params
        const page = LEGAL[section]
        return {
            page
        }
    }
}
</script>
