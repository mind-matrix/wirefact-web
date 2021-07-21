<template>
<v-container fluid>
    <tiptap-vuetify
        v-show="false"
        output-format="json"
        :extensions="extensions"
        aria-hidden="true"
        :native-extensions="nativeExtensions"
        @init="initEditor"
        :disabled="true"
    />
    <v-list v-if="loaded">
        <v-list-item v-for="comment of comments" :key="comment.id">
            <v-list-item-avatar>
                <v-avatar>
                    <v-img :src="comment.author.gravatar"></v-img>
                </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content v-if="comment.html">
                <v-list-item-title>{{ comment.author.name }}</v-list-item-title>
                <v-list-item-subtitle>
                    <v-row dense>
                        <v-col>
                            @{{ comment.author.username }}
                        </v-col>
                        <v-col class="text-right">
                            <v-menu v-if="comment.canEdit || comment.canDelete" offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-on="on" v-bind="attrs" x-small icon>
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list dense>
                                    <v-list-item v-if="comment.canEdit" style="max-height: 25px;" dense>
                                        <v-list-item-avatar>
                                            <v-icon>mdi-pen</v-icon>
                                        </v-list-item-avatar>
                                        <v-list-item-content>Edit</v-list-item-content>
                                    </v-list-item>
                                    <v-list-item v-if="comment.canDelete" @click="deleteComment(comment)" style="max-height: 25px;" dense>
                                        <v-list-item-avatar>
                                            <v-icon color="red">mdi-delete</v-icon>
                                        </v-list-item-avatar>
                                        <v-list-item-content class="red--text">Delete</v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                            
                        </v-col>
                    </v-row>
                </v-list-item-subtitle>
                <div v-html="comment.html"></div>
            </v-list-item-content>
            <v-list-item-action>
                
            </v-list-item-action>
        </v-list-item>
    </v-list>
    <v-progress-circular v-else-if="!error"></v-progress-circular>
    <v-container v-else class="text-center">
        {{ error }}
    </v-container>
</v-container>
</template>

<script>
import { EXTENSIONS, NATIVE_EXTENSIONS } from '~/assets/extensions'
import { ClientService } from '~/service'
import { TiptapVuetify } from "tiptap-vuetify"
import { UserRole } from '~/assets/roles'

export default {
    props: ["postId"],
    components: {
        TiptapVuetify,
    },
    data: () => ({
        client: null,
        comments: null,
        loaded: false,
        error: false,
        editor: null,
        extensions: EXTENSIONS,
        nativeExtensions: NATIVE_EXTENSIONS
    }),
    mounted() {
        this.client = new ClientService(this.$store)
        this.client.get(`comment?postId=${this.postId}`).then(({ comments }) => {
            this.comments = comments
            if (this.editor && !this.loaded) this.loadComments()
        }).catch((err) => {
            this.error = err.message
        })
    },
    methods: {
        refresh() {
            this.client.get(`comment?postId=${this.postId}`).then(({ comments }) => {
                this.comments = comments
                this.loadComments()
            }).catch((err) => {
                this.error = "There was a problem loading the comments..."
            })
        },
        initEditor({ editor }) {
            this.editor = editor
            if (this.comments && !this.loaded) this.loadComments()
        },
        loadComments() {
            for (let comment of this.comments) {
                comment.canEdit = this.canEdit(comment)
                comment.canDelete = this.canDelete(comment)
                if (comment.censored) {
                    comment.html = `<i class="v-icon notranslate mdi mdi-clock-outline theme--light" style="font-size: 16px;"></i><i> &lt; This comment has been censored by moderators &gt; <a href="/about/censorship">Read more</a> </i>`
                } else {
                    this.editor.setContent(comment.content)
                    comment.html = this.editor.getHTML()
                }
            }
            console.log(this.comments)
            this.loaded = true
        },
        deleteComment(comment) {
            this.client.delete("comment", comment.id).then(() => {
                this.refresh()
            }).catch((err) => {
                this.error = "There was a problem deleting a comment..."
            })
        },
        canEdit(comment) {
            if (comment.censored) return false
            if (!this.$store.state.user || comment.author.username !== this.$store.state.user.username) return false
            return true
        },
        canDelete(comment) {
            if (comment.censored) return false
            if (!this.$store.state.user || !(this.$store.state.user.role >= UserRole.MODERATOR || comment.author.username === this.$store.state.user.username)) return false
            return true
        }
    }
}
</script>
