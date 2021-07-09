<template>
    <w-post-list :posts="posts" @change="update"></w-post-list>
</template>

<script>
import { ClientService } from '~/service'
export default {
    data: () => ({
        posts: [],
        client: null
    }),
    mounted() {
        this.client = new ClientService(this.$store)
        this.update()
    },
    methods: {
        update() {
            this.client.get("published-posts").then(({ posts }) => {
                this.posts = posts
            })
        }
    }
}
</script>
