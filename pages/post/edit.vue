<template>
  <w-editor-page publishable draftable @publish="onPublish" @draft="onDraft"></w-editor-page>
</template>

<script>
export default {
  layout: "editor",
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
  }
}
</script>
