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
import { ABOUT } from '~/assets/doc'
export default {
    async asyncData({ route }) {
        const { subsection } = route.params
        const page = ABOUT[subsection]
        return {
            page
        }
    }
}
</script>
