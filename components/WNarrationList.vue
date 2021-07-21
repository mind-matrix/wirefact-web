<template>
  <v-card elevation="0" class="mx-auto">
    <v-slide-group show-arrows>
      <v-slide-item v-for="post of posts" :key="post.id">
          <v-card :max-width="safeWidth" elevation="0" outlined class="mx-2" :max-height="150">
              <v-card-title class="text-caption pt-10 pb-0">
                  {{ post.title.substr(0, 70) }}{{ post.title.length > 60 ? '...':'' }}
                  <v-btn link :to="`/post/${post.id}`" absolute top right x-small icon>
                      <v-icon>mdi-open-in-new</v-icon>
                  </v-btn>
              </v-card-title>
              <v-card-text>
                <vue-plyr :options="options">
                    <audio :src="`https://wirefact-media.s3.ap-south-1.amazonaws.com/${post.narration.female}`" type="audio/mp3"></audio>
                </vue-plyr>
              </v-card-text>
          </v-card>
      </v-slide-item>
    </v-slide-group>
  </v-card>
</template>

<script>
export default {
  props: ["posts"],
  computed: {
      safeWidth() {
          return window.innerWidth - 100
      }
  },
  data: () => ({
      options: {
          controls: ['play', 'current-time', 'mute', 'volume']
      }
  })
};
</script>
