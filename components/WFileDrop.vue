<template>
  <v-sheet
    id="dropzone"
    ref="dzone"
    tabindex="0"
    title="Click here to select a file"
    width="100%"
    style="cursor: pointer"
    height="200"
    class="pa-2"
    @click="openFileDialog"
    @keyup.enter="openFileDialog"
  >
    <input
      ref="upload"
      id="fileUpload"
      type="file"
      accept="image/*"
      style="display: none"
    />
    <v-row v-show="!uploading" class="pt-10" justify="center">
      <v-icon v-if="!dragover" size="50"
        >mdi-image-plus</v-icon
      >
      <v-icon v-if="dragover" size="50"
        >mdi-cloud-upload</v-icon
      >
    </v-row>
    <v-row v-show="!uploading" justify="center">
      <span v-if="!dragover" class="px-2 pt-2 text-h6 font-weight-light text-center"
        >Drag'n drop or click to upload a file</span
      >
      <span v-if="dragover" class="px-2 pt-2 text-h6 font-weight-light text-center"
        >Drop here to upload</span
      >
    </v-row>
    <v-row v-if="uploading">
      <v-col cols="12">
        Uploading...
      </v-col>
      <v-col cols="12">
        <v-progress-linear
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
export default {
  props: {
    uploading: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dragover: false,
    ignoreClick: true,
    fileupload: null
  }),
  mounted() {
    const dropzone = this.$el;
    const fileupload = this.$el.firstElementChild;
    this.fileupload = fileupload
    // register listeners on your dropzone / v-sheet
    if (dropzone) {
      // register all drag & drop event listeners
      dropzone.addEventListener("dragenter", (e) => {
        e.preventDefault();
        this.dragover = true;
      });
      dropzone.addEventListener("dragleave", (e) => {
        e.preventDefault();
        this.dragover = false;
      });
      dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        this.dragover = true;
      });
      dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragevent = e;
        if (dragevent.dataTransfer) {
          this.filesSelected(dragevent.dataTransfer.files);
        }
      });
      if (fileupload) {
        fileupload.addEventListener("change", (e) => {
          const target = e.target;
          if (target.files) {
            this.filesSelected(target.files);
          }
        });
      }
    }
  },
  methods: {
    filesSelected(fileList) {
      this.$emit("files-selected", fileList);
      this.dragover = false;
    },
    openFileDialog() {
        this.fileupload.click();
    }
  },
};
</script>