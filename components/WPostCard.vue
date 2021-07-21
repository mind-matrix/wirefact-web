<template>
    <v-card link :to="`/post/${slug || id}`" outlined>
        <div v-if="narration" class="ribbon">
            <span>narrated</span>
        </div>
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
            <w-share v-bind="$props"></w-share>
            <v-btn @click.prevent="toggleFavourite()" icon>
                <v-icon>
                    {{ isFavourite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import WImg from "~/components/WImg"

export default {
    props: ['id','title','slug','author','excerpt','hashtags','cover','createdAt','narration'],
    components: {
        WImg
    },
    computed: {
        date() {
            return new Date(this.createdAt)
        },
        isFavourite() {
            return this.$store.state.favourites.includes(this.id)
        }
    },
    methods: {
        toggleFavourite() {
            this.$store.commit("toggleFav", this.id)
        }
    }
}
</script>

<style scoped>
.ribbon {
  position: absolute;
  right: -5px; top: -5px;
  z-index: 1;
  overflow: hidden;
  width: 75px; height: 75px;
  text-align: right;
}
.ribbon span {
  font-size: 10px;
  font-weight: bold;
  color: #FFF;
  text-transform: uppercase;
  text-align: center;
  line-height: 20px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  width: 100px;
  display: block;
  background: #79A70A;
  background: linear-gradient(#1e5799 0%, #1E5799 100%);
  box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);
  position: absolute;
  top: 19px; right: -21px;
}
.ribbon span::before {
  content: "";
  position: absolute; left: 0px; top: 100%;
  z-index: -1;
  border-left: 3px solid #1E5799;
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #1E5799;
}
.ribbon span::after {
  content: "";
  position: absolute; right: 0px; top: 100%;
  z-index: -1;
  border-left: 3px solid transparent;
  border-right: 3px solid #1E5799;
  border-bottom: 3px solid transparent;
  border-top: 3px solid #1E5799;
}
</style>
