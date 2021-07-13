<template>
  <w-editor-page :value="post" publishable draftable draft-text="save changes" @publish="onPublish" @draft="onDraft"></w-editor-page>
</template>

<script>
import { ClientService } from "~/service";

export default {
  layout: "editor",
  data: () => ({
    client: null,
    post: null
  }),
  methods: {
    onDraft(draft) {
      this.client
        .post("post", draft)
        .then((response) => {
          this.$router.replace("/posts/draft");
        })
        .catch((err) => {
          console.log(`E: ${err.message || "unknown error"}`);
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    onPublish(post) {
      this.client
        .post("post", post)
        .then((response) => {
          this.$router.replace("/posts/published");
        })
        .catch((err) => {
          console.log(`E: ${err.message || "unknown error"}`);
        })
        .finally(() => {
          this.submitting = false;
        });
    },
  },
  mounted() {
    this.client = new ClientService(this.$store)
    this.client.get("post",this.$route.params.id).then(({ draft: post }) => {
      this.post = post
    })
  }
}
</script>
