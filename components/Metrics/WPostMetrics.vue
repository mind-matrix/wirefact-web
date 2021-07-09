<template>
  <v-card outlined>
    <v-card-title>
      <v-icon> mdi-file </v-icon>
      Posts
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="4">
          <h1 class="d-block text-body-1 font-weight-bold">
            Total
            <small class="d-block">
              {{ total }}
            </small>
          </h1>
        </v-col>
        <v-col cols="4">
          <h1 class="d-block text-body-1 font-weight-bold">
            Published
            <small class="d-block">
              {{ published }}
            </small>
          </h1>
        </v-col>
        <v-col cols="4">
          <h1 class="d-block text-body-1 font-weight-bold">
            Drafts
            <small class="d-block">
              {{ drafts }}
            </small>
          </h1>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { ClientService } from '~/service'
export default {
    data: () => ({
        client: null,
        published: 0,
        drafts: 0,
        total: 0
    }),
    async mounted() {
        this.client = new ClientService(this.$store)
        this.published = (await this.client.get("posts", "count")).count
        this.drafts = (await this.client.get("drafts", "count")).count
        this.total = this.published + this.drafts
    }
}
</script>
