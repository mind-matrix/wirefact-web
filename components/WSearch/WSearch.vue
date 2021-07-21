<template>
    <v-autocomplete rounded placeholder="Search..." :search-input.sync="query" @update:search-input="suggest" :items="suggestions" dense outlined item-text="text" item-value="text">
        <template v-slot:append>
            <v-icon>mdi-magnify</v-icon>
        </template>
        <template v-slot:item="{ item }">
            <template v-if="(typeof item) !== 'object'">
                <v-list-item-content v-text="item"></v-list-item-content>
            </template>
            <w-post-search-result v-else-if="item.post" v-bind="item.post"></w-post-search-result>
            <w-user-search-result v-else v-bind="item.user"></w-user-search-result>
        </template>
    </v-autocomplete>
</template>

<script>
import { ClientService } from '~/service'
import WPostSearchResult from './WPostSearchResult.vue'
import WUserSearchResult from './WUserSearchResult.vue'

export default {
    components: {
        WPostSearchResult,
        WUserSearchResult
    },
    data: () => ({
        query: null,
        client: null,
        suggestions: []
    }),
    mounted() {
        this.client = new ClientService(this.$store)
    },
    methods: {
        suggest() {
            this.suggestions = []
            this.client.get(`profile/${this.query}`).then(({ user }) => {
                this.suggestions.push({ user, text: user.name })
            }).catch((err) => {
                // ignore
            })
            this.client.get(`posts/search?q=${this.query}`).then(({ posts }) => {
                console.log(posts)
                this.suggestions.push(...posts.map(post => ({ post, text: post.title })))
                console.log(this.suggestions)
            }).catch((err) => {
                // ignore
            })
        }
    }
}
</script>
