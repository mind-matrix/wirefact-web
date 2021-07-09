<template>
  <v-container class="pa-0 ma-0" fluid>
    <tiptap-vuetify
      v-model="content"
      output-format="json"
      :extensions="extensions"
      :native-extensions="nativeExtensions"
      placeholder="Write something amazing...*"
      @init="initEditor"
    >
      <template #toolbar-after>
        <v-toolbar color="grey lighten-4" flat dense>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click="selectImage = true"
                v-on="on"
                v-bind="attrs"
                icon
                dense
              >
                <v-icon>mdi-image</v-icon>
              </v-btn>
            </template>
            <span>Image</span>
          </v-tooltip>
        </v-toolbar>
      </template>
    </tiptap-vuetify>
    <v-dialog v-model="selectImage" max-width="600">
      <v-card>
        <v-card-title>Select Image</v-card-title>
        <v-card-text class="pb-0">
          <v-container>
            <w-media-gallery v-model="imageSelection"></w-media-gallery>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            @click="selectImage = false"
            color="grey"
            elevation="0"
            outlined
          >
            cancel
          </v-btn>
          <v-btn
            @click="appendImage"
            :disabled="!imageSelection"
            color="primary"
            elevation="0"
          >
            select
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {
  TiptapVuetify,
} from "tiptap-vuetify";

import { EXTENSIONS, NATIVE_EXTENSIONS } from "~/assets/extensions"

export default {
  props: ["value"],
  // specify TiptapVuetify component in "components"
  components: { TiptapVuetify },
  data: () => ({
    // declare extensions you want to use
    extensions: EXTENSIONS,
    nativeExtensions: NATIVE_EXTENSIONS,
    // starting editor's content
    content: null,
    editor: null,
    imageSelection: null,
    selectImage: false,
  }),
  mounted() {
    this.content = this.value
  },
  watch: {
    content: {
      handler(val) {
        this.$emit("input", val)
      }
    },
    value: {
      handler(val) {
        this.content = val
      }
    }
  },
  methods: {
    initEditor({ editor }) {
      this.editor = editor;
    },
    appendImage() {
      if (!this.imageSelection) return;
      const width = Math.min(240, this.imageSelection.metadata.width);
      const aspectRatio =
        this.imageSelection.metadata.width /
        this.imageSelection.metadata.height;
      const height = width / aspectRatio;
      let command = this.editor.commands.image;
      console.log(this.imageSelection)
      command({
        src: `https://wirefact-media.s3.ap-south-1.amazonaws.com/${this.imageSelection.key}`,
        width,
        height,
        alt: "Sample",
        dataId: this.imageSelection.id,
        dataKey: this.imageSelection.key
      });
      this.selectImage = false;
    },
  },
};
</script>

<style>
.tiptap-vuetify-editor__content {
  max-height: calc(100vh - 220px);
}

@media screen and (max-width: 715px) {
  .tiptap-vuetify-editor__content {
    max-height: calc(100vh - 240px);
  }
}

@media screen and (max-width: 395px) {
  .tiptap-vuetify-editor__content {
    max-height: calc(100vh - 260px);
  }
}

.tiptap-vuetify-editor__content img {
  display: block;
  height: auto;
  max-width: 100%;
  margin: 0 auto;
}
.tiptap-vuetify-editor > .v-card {
  box-shadow: none !important;
  border: 1.5px solid grey;
}
</style>
