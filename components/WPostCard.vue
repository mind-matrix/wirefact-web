<template>
    <v-card link :to="`/post/${id}`" outlined>
        <v-img v-if="cover" width="100%" height="auto" max-height="280" :src="`https://wirefact-media.s3.ap-south-1.amazonaws.com/${cover.key}`"></v-img>
        <v-card-subtitle class="pl-0 pb-0">
            <v-row dense>
                <v-col cols="auto" class="pa-0 px-2">
                    <v-avatar @click.prevent="$router.push(`/profile/${author.username}`)" max-width="30" height="auto">
                        <v-img :src="author.gravatar" max-width="30" height="auto"></v-img>
                    </v-avatar>
                </v-col>
                <v-col class="pa-0">
                    <v-row dense>
                        <v-col cols="12" class="pa-0">
                            <v-hover v-slot="{ hover }">
                                <span @click.prevent="$router.push(`/profile/${author.username}`)" :class="hover ? 'black--text':''">
                                    {{ author.name }}
                                </span>
                            </v-hover>
                        </v-col>
                        <v-col cols="12" class="pa-0">
                            {{ `${ date.toLocaleString('default', { month: 'short' }) } ${ date.getDate() }, ${ date.getFullYear() }` }}
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-subtitle>
        <v-card-title>
            {{ title }}
        </v-card-title>
        <v-card-text>
            {{ excerpt }}
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>mdi-heart</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import WImg from "~/components/WImg"

export default {
    props: ['id','title','author','excerpt','cover','createdAt'],
    components: {
        WImg
    },
    computed: {
        date() {
            return new Date(this.createdAt)
        }
    },
    mounted() {
        console.log(this.cover)
    }
}
</script>
