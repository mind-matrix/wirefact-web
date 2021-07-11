<template>
  <v-container fluid>
    <v-app-bar fixed app flat>
      <v-app-bar-nav-icon @click.stop="toggleSidebar" />
      <v-container class="pt-10" fluid>
        <v-text-field
          class="py-2"
          label="Title*"
          v-model="title"
          outlined
          dense
        ></v-text-field>
      </v-container>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click.stop="openSettings" v-on="on" v-bind="attrs" icon>
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
        <span>settings</span>
      </v-tooltip>
    </v-app-bar>
    <w-editor ref="editor" v-model="content"></w-editor>

    <v-navigation-drawer app v-model="settings" width="400" temporary right>
      <v-list class="pb-4" dense>
        <v-list-item>
          <v-list-item-title> Post Settings </v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Cover*</v-list-item-title>
            <v-skeleton-loader
              loading
              type="image"
              v-if="!cover"
              height="240"
            >
            </v-skeleton-loader>
            <v-img :src="`https://wirefact-media.s3.ap-south-1.amazonaws.com/${this.cover.key}`" v-else height="240" contain></v-img>
            <v-btn @click="selectCover = true" absolute style="top: 50%; left: 50%; transform: translate(-50%, -50%);" icon>
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Title</v-list-item-title>
            <v-text-field
              v-model="title"
              outlined
              placeholder="Enter a title..."
              dense
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Hashtags</v-list-item-title>
            <v-combobox
              ref="hashtags"
              v-model="hashtags"
              :search-input.sync="currtag"
              @keyup="onCommaKey"
              @change="onHashTag"
              multiple
              small-chips
              outlined
              dense
              deletable-chips
              return-object
            ></v-combobox>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Topics</v-list-item-title>
            <v-combobox
              ref="topics"
              v-model="topics"
              multiple
              small-chips
              outlined
              dense
              deletable-chips
              return-object
            ></v-combobox>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Excerpt</v-list-item-title>
            <v-textarea counter hint="Try to keep less than 180 characters" persistent-hint v-model="excerpt" outlined></v-textarea>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pb-10">
          <v-list-item-content>
            <v-list-item-title>AutoGen (Coming Soon)</v-list-item-title>
            <v-btn disabled block elevation="0" outlined rounded>
              <v-icon class="pl-1">mdi-file-document-outline</v-icon>
              generate title
            </v-btn>
            <v-btn @click="generate('hashtags')" block elevation="0" outlined rounded>
              <v-icon class="pl-1">mdi-pound</v-icon>
              find hashtags
            </v-btn>
            <v-btn @click="generate('topics')" block elevation="0" outlined rounded>
              <v-icon class="pl-1">mdi-text-short</v-icon>
              find topics
            </v-btn>
            <v-btn @click="generate('excerpt')" block elevation="0" outlined rounded>
              <v-icon class="pl-1">mdi-image-text</v-icon>
              generate excerpt
            </v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-footer absolute>
        <v-spacer></v-spacer>
        <v-btn :disabled="!isValid() || submitting" @click="onDraft" elevation="0" color="success" outlined class="mr-2">
          save draft
        </v-btn>
        <v-btn :disabled="!isValid() || submitting" @click="onPublish" elevation="0" color="primary">
          publish
        </v-btn>
      </v-footer>
    </v-navigation-drawer>
    <v-dialog v-model="selectCover" max-width="600">
      <v-card>
        <v-card-title>Select a Cover image</v-card-title>
        <v-card-text>
          <v-container style="position: relative">
            <w-media-gallery v-model="coverSelection"></w-media-gallery>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="selectCover = false"
            color="grey"
            elevation="0"
            outlined
          >
            cancel
          </v-btn>
          <v-btn
            @click="updateCover"
            :disabled="!coverSelection"
            color="primary"
            elevation="0"
          >
            select
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-footer class="white">
      * denotes <strong class="mx-1">required</strong> fields
    </v-footer>
  </v-container>
</template>

<script>
import hashtagfy from "hashtagfy";
import { AutoGenService, ClientService } from '~/service';

function findImage(content) {
  if (!content) return null
  for (let item of content) {
    if (item.type === "image") {
      return item
    } else if (item.content && Array.isArray(item.content)) {
      let image = findImage(item.content)
      if (image) return image
    }
  }
  return null
}

function getText(html) {
  let div = document.createElement('div')
  div.innerHTML = html
  return div.innerText
}

export default {
  layout: "editor",
  data: () => ({
    title: null,
    content: null,
    settings: false,
    hashtags: [],
    currtag: null,
    topics: [],
    cover: null,
    selectCover: false,
    coverSelection: null,
    client: null,
    autogen: null,
    excerpt: null,
    submitting: false
  }),
  methods: {
    toggleSidebar() {
      this.$nuxt.$emit("toggle-sidebar")
    },
    onCommaKey(e) {
      if (e.key === ",") {
        e.preventDefault()
        if (this.currtag in this.hashtags) return
        this.hashtags.push(this.currtag)
        this.currtag = null
        this.onHashTag()
      }
    },
    onHashTag() {
      this.hashtags = Array.from(new Set(this.hashtags.map(hashtag => hashtagfy(hashtag, { capitalize: false }))))
    },
    onDraft() {
      this.submitting = true
      const post = {
        title: this.title,
        content: this.content,
        hashtags: this.hashtags,
        topics: this.topics,
        cover: this.cover.id,
        excerpt: this.excerpt,
        draft: true
      }
      this.client.post("post", post).then((response) => {
        this.$router.replace("/posts/draft")
      }).catch((err) => {
        console.log(`E: ${err.message || 'unknown error'}`)
      }).finally(() => {
        this.submitting = false
      })
    },
    onPublish() {
      this.submitting = true
      const post = {
        title: this.title,
        content: this.content,
        hashtags: this.hashtags,
        topics: this.topics,
        cover: this.cover.id,
        excerpt: this.excerpt,
        draft: false
      }
      this.client.post("post", post).then((response) => {
        this.$router.replace("/posts/published")
      }).catch((err) => {
        console.log(`E: ${err.message || 'unknown error'}`)
      }).finally(() => {
        this.submitting = false
      })
    },
    updateCoverFromContent() {
      if (!this.cover && this.content) {
        let image = findImage(this.content.content)
        if (image) {
          this.cover = { id: image.attrs.dataId, key: image.attrs.dataKey }
        }
      }
    },
    updateCover() {
      this.cover = this.coverSelection
      this.selectCover = false
    },
    openSettings() {
      this.settings = true
      this.updateCoverFromContent()
    },
    isValid() {
      return this.title && this.title.trim().length && this.content && this.cover
    },
    async generate(event) {
      let html = this.$refs.editor.editor.getHTML()
      let text = getText(html)
      if (!text.trim().length) return

      if (event === "excerpt") {
        let candidates = this.autogen.excerpt(text)
        this.excerpt = candidates[Math.floor(Math.random()*candidates.length)].content.trim()
      } else if (event === "topics") {
        let topics = this.autogen.topics(text).slice(0, 10)
        this.topics = topics
      } else if (event === "hashtags") {
        let hashtags = this.autogen.hashtags(text)
        this.hashtags = hashtags
      }
    }
  },
  mounted() {
    this.client = new ClientService(this.$store)
    this.autogen = new AutoGenService(this.$store)
  }
};
</script>
