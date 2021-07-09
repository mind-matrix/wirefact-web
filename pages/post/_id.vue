<template>
  <v-container fluid>
    <v-container v-if="post" fluid>
      <v-container class="mb-4" fluid>
        <v-avatar class="mr-2">
          <v-img :max-height="50" width="auto" contain :src="post.author.gravatar"></v-img>
        </v-avatar>
        <h1 class="d-inline-block text-body-1" style="vertical-align: middle;">
            {{ post.author.name }}
            <small class="d-block text-caption">
                @{{ post.author.username }}
            </small>
        </h1>
        <v-spacer></v-spacer>
      </v-container>
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

export default {
  components: {
    TiptapVuetify,
  },
  data: () => ({
    client: null,
    post: null,
    content: null,
    editor: null,
    extensions: EXTENSIONS,
    nativeExtensions: NATIVE_EXTENSIONS,
  }),
  mounted() {
    this.client = new ClientService(this.$store);
    this.client
      .get("post", this.$route.params.id)
      .then(({ post }) => {
        this.post = post;
        if (this.editor && !this.content) {
          this.content = this.editor.getHTML();
        }
      })
      .catch((err) => {
        this.$nuxt.error({
          message: err.message || "could not load post/draft",
        });
      });
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
