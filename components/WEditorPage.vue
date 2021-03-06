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
            <v-skeleton-loader loading type="image" v-if="!cover" height="240">
            </v-skeleton-loader>
            <v-img
              :src="`https://wirefact-media.s3.ap-south-1.amazonaws.com/${this.cover.key}`"
              v-else
              height="240"
              contain
            ></v-img>
            <v-btn
              @click="selectCover = true"
              absolute
              style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
              icon
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-list-item-content>
        </v-list-item>
        <template v-if="['ADMIN'].includes(role)">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Publishing Date</v-list-item-title>
              <v-datetime-picker
                v-model="createdAt"
                type="datetime"
                outlined
                placeholder="Enter a valid date"
                dense
              >
                <template v-slot:dateIcon>
                  <v-icon>mdi-calendar</v-icon>
                </template>
                <template v-slot:timeIcon>
                  <v-icon>mdi-clock</v-icon>
                </template>
              </v-datetime-picker>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Author</v-list-item-title>
              <w-user-select v-model="author"></w-user-select>
            </v-list-item-content>
          </v-list-item>
        </template>
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
            <v-list-item-title>slug</v-list-item-title>
            <v-text-field
              v-model="slug"
              :color="slugExists ? 'red':'primary'"
              :error-messages="slugExists ? 'A post with this slug already exists. Try to change the wording.':null"
              persistent-hint
              outlined
              placeholder="Enter a slug (Optional)"
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
            <v-textarea
              counter
              hint="Try to keep less than 180 characters"
              persistent-hint
              v-model="excerpt"
              outlined
            ></v-textarea>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="pb-10">
          <v-list-item-content>
            <v-list-item-title>AutoGen (Coming Soon)</v-list-item-title>
            <v-btn disabled block elevation="0" outlined rounded>
              <v-icon class="pl-1">mdi-file-document-outline</v-icon>
              generate title
            </v-btn>
            <v-btn
              @click="generate('hashtags')"
              block
              elevation="0"
              outlined
              rounded
            >
              <v-icon class="pl-1">mdi-pound</v-icon>
              find hashtags
            </v-btn>
            <v-btn
              @click="generate('topics')"
              block
              elevation="0"
              outlined
              rounded
            >
              <v-icon class="pl-1">mdi-text-short</v-icon>
              find topics
            </v-btn>
            <v-btn
              @click="generate('excerpt')"
              block
              elevation="0"
              outlined
              rounded
            >
              <v-icon class="pl-1">mdi-image-text</v-icon>
              generate excerpt
            </v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-footer absolute>
        <v-spacer></v-spacer>
        <v-btn
          v-if="draftable"
          :disabled="!isValid() || submitting"
          @click="onDraft"
          elevation="0"
          color="success"
          outlined
          class="mr-2"
        >
          {{ draftText || 'save draft' }}
        </v-btn>
        <v-btn
         v-if="publishable"
          :disabled="!isValid() || submitting"
          @click="onPublish"
          elevation="0"
          color="primary"
        >
          {{ publishText || 'publish' }}
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
import { AutoGenService, ClientService } from "~/service";
import { UserRole } from "~/assets/roles";
import slugify from "slugify";

function findImage(content) {
  if (!content) return null;
  for (let item of content) {
    if (item.type === "image") {
      return item;
    } else if (item.content && Array.isArray(item.content)) {
      let image = findImage(item.content);
      if (image) return image;
    }
  }
  return null;
}

function getText(html) {
  let div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText;
}

export default {
  props: {
      publishable: Boolean,
      publishText: String,
      draftable: Boolean,
      draftText: String,
      value: Object
  },
  data: () => ({
    title: null,
    content: null,
    settings: false,
    hashtags: [],
    currtag: null,
    topics: [],
    cover: null,
    slug: null,
    slugExists: false,
    selectCover: false,
    coverSelection: null,
    client: null,
    autogen: null,
    excerpt: null,
    submitting: false,
    createdAt: new Date(),
    author: null,
  }),
  computed: {
    role() {
      return Object.keys(UserRole).find(
        (role) => UserRole[role] === this.$store.state.user.role
      );
    },
  },
  methods: {
    toggleSidebar() {
      this.$nuxt.$emit("toggle-sidebar");
    },
    onCommaKey(e) {
      if (e.key === ",") {
        e.preventDefault();
        if (this.currtag in this.hashtags) return;
        this.hashtags.push(this.currtag);
        this.currtag = null;
        this.onHashTag();
      }
    },
    onHashTag() {
      this.hashtags = Array.from(
        new Set(
          this.hashtags.map((hashtag) =>
            hashtagfy(hashtag, { capitalize: false })
          )
        )
      );
    },
    onDraft() {
      this.submitting = true;
      const post = {
        title: this.title,
        content: this.content,
        hashtags: this.hashtags,
        topics: this.topics,
        cover: this.cover.id,
        excerpt: this.excerpt,
        draft: true,
      };

      if (this.$store.state.user.role === UserRole.ADMIN) {
        if (this.author) post.author = this.author.id;
        if (this.createdAt) post.createdAt = this.createdAt;
      }

      if (this.slug && !this.slugExists && this.slug.trim().length) {
        post.slug = this.slug.trim()
      }

      this.$emit("draft", post)
      this.submitting = false;
    },
    onPublish() {
      this.submitting = true;
      const post = {
        title: this.title,
        content: this.content,
        hashtags: this.hashtags,
        topics: this.topics,
        cover: this.cover.id,
        excerpt: this.excerpt,
        draft: false,
      };

      if (this.$store.state.user.role === UserRole.ADMIN) {
        if (this.author) post.author = this.author.id;
        if (this.createdAt) post.createdAt = this.createdAt;
      }

      if (this.slug && !this.slugExists && this.slug.trim().length) {
        post.slug = this.slug.trim()
      }

      this.$emit("publish", post)
      this.submitting = false
    },
    updateCoverFromContent() {
      if (!this.cover && this.content) {
        let image = findImage(this.content.content);
        if (image) {
          this.cover = { id: image.attrs.dataId, key: image.attrs.dataKey };
        }
      }
    },
    updateCover() {
      this.cover = this.coverSelection;
      this.selectCover = false;
    },
    openSettings() {
      this.settings = true;
      this.updateCoverFromContent();
    },
    isValid() {
      return (
        this.title && this.title.trim().length && this.content && this.cover
      );
    },
    async generate(event) {
      let html = this.$refs.editor.editor.getHTML();
      let text = getText(html);
      if (!text.trim().length) return;

      if (event === "excerpt") {
        let candidates = this.autogen.excerpt(text);
        this.excerpt =
          candidates[
            Math.floor(Math.random() * candidates.length)
          ].content.trim();
      } else if (event === "topics") {
        let topics = this.autogen.topics(text).slice(0, 10);
        this.topics = topics;
      } else if (event === "hashtags") {
        let hashtags = this.autogen.hashtags(text);
        this.hashtags = hashtags;
      }
    },
    updateByValue() {
        if (this.value) {
            this.id = this.value.id
            this.title = this.value.title
            this.content = this.value.content
            this.hashtags = this.value.hashtags
            this.topics = this.value.topics
            this.cover = this.value.cover
            this.excerpt = this.value.excerpt
            this.draft = this.value.draft
            this.author = this.value.author
            this.createdAt = new Date(this.value.createdAt)
        }
    }
  },
  mounted() {
    this.client = new ClientService(this.$store);
    this.autogen = new AutoGenService(this.$store);
    this.updateByValue();
  },
  watch: {
    value: {
      handler(val) {
        this.updateByValue();
      }
    },
    title: {
      async handler(val) {
        if (!val || !val.trim().length) return
        this.slug = slugify(val, { lower: true })
        let { exists } = await this.client.post("post-exists", { slug: this.slug })
        if (exists) {
          this.slug = `${this.slug}-${Math.floor(Math.random()*1000)}`
        }
      }
    },
    slug: {
      async handler(val) {
        this.slug = slugify(val, { lower: true })
        this.slugExists = false
        if (!this.slug.trim().length) return
        let { exists } = await this.client.post("post-exists", { slug: this.slug })
        if (exists) {
          this.slugExists = true
        }
      }
    }
  }
};
</script>
