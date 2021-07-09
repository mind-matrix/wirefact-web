<template>
    <v-container fluid>
        <template v-if="!page">
            <v-container class="text-center" fluid>
                <v-progress-circular indeterminate></v-progress-circular>
            </v-container>
        </template>
        <nuxt-content v-else :document="page"></nuxt-content>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        page: null
    }),
    async mounted() {
        this.page = await this.$content(`about/index`).fetch()
    }
}
</script>
