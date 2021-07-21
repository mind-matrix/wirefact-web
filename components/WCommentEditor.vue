<template>
  <v-container fluid>
    <tiptap-vuetify
      v-model="content"
      output-format="json"
      :extensions="extensions"
      :native-extensions="nativeExtensions"
      placeholder="Write your comment..."
    ></tiptap-vuetify>
    <v-btn @click="publish" color="success" class="mt-2" elevation="0"> publish </v-btn>
  </v-container>
</template>

<script>
import { TiptapVuetify } from "tiptap-vuetify";

import { EXTENSIONS, NATIVE_EXTENSIONS } from "~/assets/extensions";
import { ClientService } from '~/service';

export default {
  props: ["postId"],
  components: { TiptapVuetify },
  data: () => ({
    client: null,
    content: null,
    extensions: EXTENSIONS,
    nativeExtensions: NATIVE_EXTENSIONS,
  }),
  mounted() {
    this.client = new ClientService(this.$store)
  },
  methods: {
    publish() {
      this.client.post("comment", { postId: this.postId, content: this.content }).then(() => {
        this.$emit("update")
      })
    }
  }
};
</script>
