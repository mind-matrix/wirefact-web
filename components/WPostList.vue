<template>
    <v-list v-if="posts.length" class="mx-auto" max-width="800">
        <v-list-item link :to="`/${ post.draft ? 'draft':'post' }/${post.id}`" v-for="post of posts" :key="post.id">
            <v-avatar class="mr-2 grey lighten-1">
                <v-img v-if="post.cover" :src="`https://wirefact-media.s3.ap-south-1.amazonaws.com/${post.cover.key}`"></v-img>
                <span v-else></span>
            </v-avatar>
            <v-list-item-content>
                <v-list-item-title v-text="post.title"></v-list-item-title>
            </v-list-item-content>
            <v-spacer></v-spacer>
            <v-list-item-action v-if="post.draft">
                <v-tooltip>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn @click.prevent="publishPost(post.id)" v-on="on" v-bind="attrs" icon color="success">
                            <v-icon>mdi-file-upload</v-icon>
                        </v-btn>
                    </template>
                    Publish
                </v-tooltip>
            </v-list-item-action>
            <v-list-item-action>
                <v-tooltip>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn @click.prevent="editPost(post.draft, post.id)" v-on="on" v-bind="attrs" icon>
                            <v-icon>mdi-pen</v-icon>
                        </v-btn>
                    </template>
                    Edit
                </v-tooltip>
            </v-list-item-action>
            <v-list-item-action>
                <v-tooltip>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn @click.prevent="deletePost(post.id)" v-on="on" v-bind="attrs" icon color="red">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                    Delete
                </v-tooltip>
            </v-list-item-action>
        </v-list-item>
    </v-list>
    <v-container v-else class="text-center" fluid>
        No posts here.
    </v-container>
</template>

<script>
import { ClientService } from '~/service'
export default {
    props: ["posts"],
    data: () => ({
        client: null
    }),
    mounted() {
        this.client = new ClientService(this.$store)
    },
    methods: {
        publishPost(id) {
            this.client.put("post", id, { draft: false }).then(() => {
                this.$emit("change")
            })
        },
        deletePost(id) {
            this.client.delete("post", id).then(() => {
                this.$emit("change")
            })
        },
        editPost(isDraft, id) {
            this.$router.push(`/${ isDraft ? 'draft' : 'post' }/update/${id}`)
        }
    }
}
</script>
