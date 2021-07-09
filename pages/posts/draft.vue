<template>
    <w-post-list :posts="drafts" @change="update"></w-post-list>
</template>

<script>
import { ClientService } from '~/service'
export default {
    data: () => ({
        drafts: [],
        client: null
    }),
    mounted() {
        this.client = new ClientService(this.$store)
        this.update()
    },
    methods: {
        update() {
            this.client.get("drafts").then(({ drafts }) => {
                this.drafts = drafts
            })
        }
    }
}
</script>
