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
        const { subsection, subsubsection } = this.$route.params
        if (!subsection || !subsubsection) this.$router.replace("/about")
        this.page = await this.$content(`about/${subsection}/${subsubsection}`).fetch()
    }
}
</script>
