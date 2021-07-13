<template>
  <w-editor-page :value="post" publishable publish-text="save changes" @publish="onPublish"></w-editor-page>
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
    this.client.get("post",this.$route.params.id).then(({ post }) => {
      this.post = post
    })
  }
}
</script>
