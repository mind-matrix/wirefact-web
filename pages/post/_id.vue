<template>
  <v-container fluid>
    <v-container v-if="post" fluid>
      <v-container class="mb-4" fluid>
        <h1 class="title">
          {{ post.title }}
          <template v-if="canCreateNarration">
            <v-container aria-hidden="true" fluid class="my-2 text-right">
              <v-btn @click="addNarration" text outlined color="black">
                <v-icon>mdi-microphone</v-icon>
                add narration
              </v-btn>
            </v-container>
          </template>
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
      <template v-if="post.narration">
        <w-narrate :narration="post.narration" :poster="post.cover" :title="post.title"></w-narrate>
      </template>
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
      <v-row>
        <v-col>  
          <h3>Comments</h3>
        </v-col>
        <v-col class="text-right">
          <v-row dense>
            <v-col cols="12">
              <v-icon>mdi-comment</v-icon>
              {{ post.comments.count }}
            </v-col>
            <v-col cols="12">
              <template v-if="post.comments.count">
                <span class="grey--text" v-if="post.comments.sentiment === 0">Mixed reviews</span>
                <span class="red--text" v-else-if="post.comments.sentiment < 0">Mostly negative reviews</span>
                <span class="green--text" v-else-if="post.comments.sentiment > 0">Mostly positive reviews</span>
              </template>
              <template v-else>
                <span class="grey--text">No reviews</span>
              </template>
              <template v-if="post.comments.positive || post.comments.negative">
                <v-icon color="green">mdi-chevron-up</v-icon>
                {{ Math.floor(post.comments.positive*100) }}%
                <v-icon color="red">mdi-chevron-down</v-icon>
                {{ Math.floor(post.comments.negative*100) }}%
              </template>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <w-comment-editor v-if="canComment" :post-id="post.id" @update="$refs.comments.refresh()"></w-comment-editor>
      <w-comment-list ref="comments" :post-id="post.id"></w-comment-list>
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
    let { post } = (await axios.get(`${process.env.API_URL}/post/${ route.params.id }?token=${process.env.APP_TOKEN}`)).data
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
    },
    canComment() {
      return (this.$store.state.user && this.$store.state.user.role >= UserRole.USER)
    },
    canCreateNarration() {
      return this.$store.state.user && this.$store.state.user.role >= UserRole.MODERATOR && this.post.author.username === this.$store.state.user.username && !this.post.narration
    }
  },
  mounted() {
    this.client = new ClientService(this.$store);
    this.client.get("post", this.$route.params.id)
    if (this.editor && !this.content) {
      this.content = this.editor.getHTML();
      setTimeout(() => this.applyContentTransforms(), 2000);
    }
  },
  methods: {
    initEditor({ editor }) {
      this.editor = editor;
      if (this.post && !this.content) {
        this.content = this.editor.getHTML();
        setTimeout(() => this.applyContentTransforms(), 2000);
      }
    },
    addNarration() {
      this.client.get("narration", this.post.id).then((response) => {
        this.$nuxt.refresh()
      }).catch((err) => {
        console.log(err.response)
      })
    },
    applyContentTransforms() {
      document.querySelectorAll("a[href]").forEach(async (link) => {
        const href = link.getAttribute("href")
        if (href && /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/g.test(href)) {
          const video = (await axios.get(`https://www.youtube.com/oembed?url=${href}&format=json`)).data
          if (video && video.html) {
            link.outerHTML = `<div class="youtube-embed"><div class="youtube-embed-container">${video.html}</div></div>`
          }
        }
      })
      document.querySelectorAll("img[data-src]").forEach((image) => {
        image.src = image.getAttribute('data-src')
      })
    }
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
