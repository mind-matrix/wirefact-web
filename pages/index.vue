<template>
  <v-container class="ma-0 pa-0" fluid>
    <v-img
      :src="require('~/assets/background-6x.jpg')"
      :lazy-src="require('~/assets/background-1x.jpg')"
      cover
      :height="heroHeight"
    >
    </v-img>
    <template v-if="loading">
      <v-container class="text-center">
        <v-progress-circular size="30" indeterminate />
        Finding fresh posts for you
      </v-container>
    </template>
    <template v-else>
      <v-row class="ma-2">
        <v-col v-for="post of posts" :key="post._id" cols="12" md="6" lg="4" xl="2">
          <w-post-card v-bind="post"></w-post-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { ClientService } from "~/service";
export default {
  layout: "default",
  head: {
    title: "Home"
  },
  data: () => ({
    posts: [],
    loading: true,
    client: null,
    heroHeight: (window.innerWidth * 400) / 1168,
  }),
  async mounted() {
    this.client = new ClientService(this.$store)
    let { posts } = await this.client.get("posts")
    this.posts = posts
    this.loading = false
  }
};
</script>
