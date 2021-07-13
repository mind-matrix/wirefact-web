<template>
  <v-container fluid>
    <v-container v-if="post" fluid>
      <v-container class="mb-4" fluid>
        <h1 class="title">
          {{ post.title }}
        </h1>
        <v-avatar class="mr-2">
          <v-img :max-height="50" width="auto" contain :src="post.author.gravatar"></v-img>
        </v-avatar>
        <h2 class="d-inline-block text-body-1" style="vertical-align: middle;">
            {{ post.author.name }}
            <small class="d-block text-caption">
                @{{ post.author.username }}
            </small>
        </h2>
        <time class="d-block text-right grey--text text--darken-1">{{ new Date(post.createdAt).toUTCString() }}</time>
      </v-container>
      <v-btn v-if="isAdmin" fab fixed app icon bottom right link :to="`/post/update/${post.id}`" class="grey lighten-3">
          <v-icon>mdi-pen</v-icon>
      </v-btn>
      <tiptap-vuetify
        v-show="false"
        v-model="post.content"
        output-format="json"
        :extensions="extensions"
        aria-hidden="true"
        :native-extensions="nativeExtensions"
        @init="initEditor"
        :disabled="true"
      />
      <div class="post-view" v-if="content" v-html="content"></div>
      <v-progress-circular
        class="d-block mx-auto"
        v-else
        indeterminate
        color="primary"
      ></v-progress-circular>

      <div>
          <template v-for="tag in post.hashtags">
              <a v-if="tag.toLowerCase() === '#lgbtq'" :key="tag">
                  <span v-for="(letter, index) in tag" :key="index" :class="`${['red','amber','yellow','green','blue','violet'][index]}--text`">{{ letter }}</span>
              </a>
              <a v-else :key="tag" href="#" class="mr-1 text-decoration-none">{{ tag }}</a>
          </template>
      </div>
      <div>
        <span class="text-body-2">
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <span style="cursor: pointer;" v-on="on" v-bind="attrs">{{ post.metrics.views.verified.count + post.metrics.views.unverified.count }} view(s)</span>
            </template>
            <span>{{ post.metrics.views.verified.count }} verified</span>
          </v-tooltip>
        </span>
      </div>
    </v-container>
    <v-progress-circular
      class="d-block mx-auto"
      v-else
      indeterminate
      color="primary"
    ></v-progress-circular>
  </v-container>
</template>

<script>
import { ClientService } from "~/service";
import { TiptapVuetify } from "tiptap-vuetify";

import { EXTENSIONS, NATIVE_EXTENSIONS } from "~/assets/extensions";
import { UserRole } from '~/assets/roles';
import axios from 'axios';

export default {
  async asyncData({ route }) {
    let { post } = (await axios.get(`${process.env.API}/post/${ route.params.id }`)).data
    return {
      metadata: {
        id: post.id,
        title: post.title,
        image: `https://wirefact-media.s3.ap-south-1.amazonaws.com/${post.cover.key}`,
        imageAlt: post.cover.alt,
        description: post.excerpt
      },
      post
    }
  },
  head() {
    return {
      title: this.metadata.title,
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.metadata.title },
        { hid: 'og:description', property: 'og:description', content: this.metadata.description },
        { hid: 'og:image', property: 'og:image', content: this.metadata.image },
        { hid: 'og:image:alt', property: 'og:image:alt', content: this.metadata.imageAlt },
        { hid: 'og:url', property: 'og:url', content: `https://wirefact.com/post/${this.metadata.id}` }
      ]
    }
  },
  components: {
    TiptapVuetify,
  },
  data: () => ({
    client: null,
    content: null,
    editor: null,
    extensions: EXTENSIONS,
    nativeExtensions: NATIVE_EXTENSIONS,
  }),
  computed: {
    isAdmin() {
      return (this.$store.state.user && this.$store.state.user.role === UserRole.ADMIN)
    }
  },
  mounted() {
    this.client = new ClientService(this.$store);
    if (this.editor && !this.content) {
      this.content = this.editor.getHTML();
    }
  },
  methods: {
    initEditor({ editor }) {
      this.editor = editor;
      if (this.post && !this.content) {
        this.content = this.editor.getHTML();
      }
    },
  },
};
</script>

<style>
.post-view img {
  display: block;
  height: auto;
  max-width: 100%;
  height: auto !important;
  margin: 0 auto;
}
</style>
