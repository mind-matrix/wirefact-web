<template>
  <v-container class="pa-0" fluid>
    <template v-if="loading">
      <v-container class="text-center" fluid>
        <v-progress-linear indeterminate rounded height="10" dark
          >Loading</v-progress-linear
        >
      </v-container>
    </template>
    <template v-else-if="images && images.length">
      <v-item-group v-model="selections" :multiple="multiple">
        <v-container @scroll="onScroll" :class="[ contained ? 'contained':'' ]" class="pa-0" fluid>
          <client-only>
            <div
              v-masonry
              transition-duration="0.3s"
              item-selector=".item"
              class="masonry-container"
            >
              <div
                v-masonry-tile
                class="item"
                v-for="image of images"
                :key="image.id"
              >
                <v-item class="pa-2" v-slot="{ active, toggle }" :value="image">
                  <w-img
                    align="center"
                    :value="image"
                    :width="image.metadata.width"
                    :min-width="140"
                    :max-width="240"
                    @click="toggle"
                    @loadeddata="$redrawVueMasonry()"
                    :elevation="active ? 4 : 0"
                  >
                    <v-btn
                      :style="{ top: '10px', left: '10px' }"
                      v-if="active"
                      color="primary"
                      absolute
                      top
                      left
                      icon
                      dark
                    >
                      <v-icon dense>mdi-check</v-icon>
                    </v-btn>
                    <template v-slot:hover>
                      <v-container
                        class="pa-0"
                        :style="{
                          position: 'absolute',
                          display: 'inline-block',
                          width: 'fit-content',
                          top: '10px',
                          right: '10px',
                        }"
                      >
                        <v-btn
                          @click.stop="openSettings(image)"
                          color="primary"
                          icon
                          dark
                        >
                          <v-icon dense>mdi-cog-outline</v-icon>
                        </v-btn>
                        <v-btn
                          @click.stop="openSettings(image)"
                          color="red"
                          icon
                          dark
                        >
                          <v-icon dense>mdi-delete</v-icon>
                        </v-btn>
                      </v-container>
                    </template>
                  </w-img>
                </v-item>
              </div>
            </div>
          </client-only>
          <v-snackbar
            :value="usageShow"
            style="z-index: 0"
            min-width="200"
            max-width="240"
            :timeout="-1"
            bottom
            left
            rounded
          >
            <v-row dense>
              <v-col cols="12">
                <div class="body-1">
                  <span>Storage Space</span>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-on="on" v-bind="attrs" x-small icon @click="usageShow = false">
                        <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    Hide Storage Report
                  </v-tooltip>
                </div>
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
              <v-col>
                <v-progress-linear
                  v-if="usage"
                  v-model="usage.percent"
                  color="white"
                  rounded
                  height="15"
                ></v-progress-linear>
                <v-progress-linear
                  v-else
                  color="white"
                  indeterminate
                  rounded
                  height="15"
                ></v-progress-linear>
              </v-col>
              <v-col cols="auto">
                {{
                  usage
                    ? `${(usage.used / Math.pow(2, 20)).toFixed(2)}MB/${
                        usage.available / Math.pow(2, 20).toFixed(2)
                      }MB`
                    : "Loading..."
                }}
              </v-col>
            </v-row>
          </v-snackbar>
          <v-tooltip v-if="!usageShow" top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" v-bind="attrs" icon fixed bottom left class="black" dark small @click="usageShow = true">
                <v-icon small>mdi-database</v-icon>
              </v-btn>
            </template>
            Show Storage Report
          </v-tooltip>
          <v-btn
            v-if="images && count && images.length < count"
            @click="loadMoreMedias"
            block
            outlined
          >
            <v-icon>
              mdi-chevron-down
            </v-icon>
            more
          </v-btn>
        </v-container>
      </v-item-group>
    </template>
    <template v-else>
      Add an image by clicking on the + button in the bottom right corner.
    </template>
    <v-btn
      color="primary"
      @click="upload = true"
      fab
      fixed
      bottom
      right
      elevation="4"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog max-width="400" v-model="upload">
      <v-card>
        <v-card-title>Upload Image</v-card-title>
        <v-card-text>
          <w-file-drop
            :uploading="uploading"
            @files-selected="onFilesSelect"
          ></w-file-drop>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-navigation-drawer v-model="settings" width="400" temporary app right>
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-title> Edit Image </v-list-item-title>
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <v-form class="pa-4" v-if="settingsImage">
        <img
          class="d-block mx-auto my-2"
          :src="`https://wirefact-media.s3.ap-south-1.amazonaws.com/${settingsImage.key}`"
          :width="100"
          :height="
            (100 * settingsImage.metadata.height) / settingsImage.metadata.width
          "
        />
        <v-text-field
          v-model="settingsImage.filename"
          label="Filename"
          outlined
          dense
        ></v-text-field>
        <v-text-field
          v-model="settingsImage.metadata.alt"
          label="Alt text"
          outlined
          dense
        ></v-text-field>
        <v-btn elevation="0" @click="settings = false"> cancel </v-btn>
        <v-btn elevation="0" color="primary" @click="saveSettings">
          save
        </v-btn>
      </v-form>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import { ClientService } from "~/service";
import WFileDrop from "~/components/WFileDrop.vue";
import _ from "lodash";
import axios from "axios";

function imageSize(url) {
  const img = document.createElement("img");

  const promise = new Promise((resolve, reject) => {
    img.onload = () => {
      // Natural size is the actual image size regardless of rendering.
      // The 'normal' `width`/`height` are for the **rendered** size.
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      // Resolve promise with the width and height
      resolve({ width, height });
    };

    // Reject promise on error
    img.onerror = reject;
  });

  // Setting the source makes it start downloading and eventually call `onload`
  img.src = url;

  return promise;
}

function strip_extension(str) {
  return str.substr(0, str.lastIndexOf("."));
}

export default {
  props: ["value", "multiple", "show-usage","contained"],
  components: {
    WFileDrop,
  },
  data: () => ({
    selections: null,
    images: [],
    client: null,
    settings: false,
    settingsImage: null,
    upload: false,
    uploading: false,
    usage: null,
    usageShow: false,
    loading: true,
    count: 0,
  }),
  async mounted() {
    this.selections = this.value;
    this.usageShow = this.showUsage || false;
    this.client = new ClientService(this.$store);
    this.updateListView();
    this.updateUsageView();
  },
  methods: {
    openSettings(image) {
      this.settingsImage = _.cloneDeep(image);
      this.settings = true;
    },
    saveSettings() {
      this.settings = false;
    },
    async onFilesSelect(fileList) {
      const file = fileList[0];
      let { key, signedRequest, url } = await this.client.post("sign-media", {
        filename: file.name,
        filetype: file.type,
      });
      this.uploading = true;
      axios
        .put(signedRequest, file)
        .then(async () => {
          let { width, height } = await imageSize(url);
          this.client
            .post("media", {
              key,
              filename: file.name,
              filetype: file.type,
              filesize: file.size,
              metadata: {
                width,
                height,
                alt: strip_extension(file.name),
              },
            })
            .then(() => {
              this.uploading = false;
              this.upload = false;
              this.updateListView();
              this.updateUsageView();
            })
            .catch((err) => {
              console.log("SE: ", err.response.status);
              this.uploading = false;
              this.upload = false;
            });
        })
        .catch((err) => {
          let status = err.response.status;
          console.log("E: ", status);
          this.uploading = false;
          this.upload = false;
        });
    },
    updateListView() {
      this.loading = true;
      this.client
        .get("medias", "count")
        .then(({ count }) => {
          this.count = count;
        })
        .catch((err) => {
          console.log("E: ", err.message, err.response);
        });
      this.client
        .get("medias")
        .then(({ medias }) => {
          this.images = medias;
          this.loading = false;
        })
        .catch((err) => {
          console.log(err.response.status);
        });
    },
    updateUsageView() {
      this.client
        .get("media-usage")
        .then(({ usage }) => {
          this.usage = {
            ...usage,
            percent: (usage.used * 100) / usage.available,
          };
        })
        .catch((err) => {
          console.log("E: ", err);
        });
    },
    loadMoreMedias() {
      if (this.images.length === this.count) return;
      let skip = this.images.length || 0;
      let limit = 10;
      this.client
        .get(`medias?skip=${skip}&limit=${limit}`)
        .then(({ medias }) => {
          console.log(medias);
          this.images.push(...medias);
        })
        .catch((err) => {
          console.log(err.response.status);
        });
    },
    onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight) {
        this.loadMoreMedias();
      }
    },
  },
  watch: {
    selections: {
      handler(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>

<style scoped>
* {
  user-select: none;
}
.contained {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
