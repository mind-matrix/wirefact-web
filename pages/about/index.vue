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
    async asyncData() {
        const page = ABOUT["index"]
        return {
            page
        }
    },
    head: {
        title: "About",
        meta: [
            { hid: 'og:url', property: 'og:url', content: 'https://wirefact.com/about' }
        ]
    }
}
</script>
