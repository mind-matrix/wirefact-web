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
        const { section } = this.$route.params
        if (!section) this.$router.replace("/about")
        this.page = await this.$content(`legal/${section}`).fetch()
    }
}
</script>
