<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-img
      :src="require('~/assets/background-6x.jpg')"
      :lazy-src="require('~/assets/background-1x.jpg')"
      cover
      :height="heroHeight"
    >
    </v-img>
    <v-container class="mx-auto body searchbar">
      <w-search></w-search>
    </v-container>
    <template v-if="loading">
      <v-container class="text-center">
        <v-progress-circular size="30" indeterminate />
        Finding fresh posts for you
      </v-container>
    </template>
    <template v-else>
      <v-container class="ma-0 pa-0" fluid>
        <v-row class="ma-2">
          <v-col cols="12">
            <header class="font-header">
              Top Narrations
            </header>
          </v-col>
          <v-col cols="12">
            <w-narration-list v-if="narrations" :posts="narrations"></w-narration-list>
          </v-col>
        </v-row>
        <v-row class="ma-2">
          <v-col cols="12">
            <header class="font-header">
              Featured Posts
            </header>
          </v-col>
          <v-col v-for="post of posts" :key="post._id" cols="12" md="6" lg="4" xl="2">
            <w-post-card v-bind="post"></w-post-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-container>
</template>

<script>
import { ClientService } from "~/service";
export default {
  layout: "default",
  head: {
    title: "Home",
    meta: [
      { hid: 'og:url', property: 'og:url', content: 'https://wirefact.com/' }
    ]
  },
  data: () => ({
    posts: [],
    narrations: [],
    loading: true,
    client: null,
    heroHeight: (window.innerWidth * 400) / 1168,
  }),
  async mounted() {
    this.client = new ClientService(this.$store)
    let { posts } = await this.client.get("posts")
    let { posts: narrations } = await this.client.get("narrations")
    this.posts = posts
    this.narrations = narrations
    this.loading = false
  }
};
</script>

<style scoped>
.searchbar {
  max-width: 400px;
}
.body.searchbar {
  display: none;
}
@media screen and (max-width: 800px) {
  .body.searchbar {
    display: block;
  }
}
</style>
