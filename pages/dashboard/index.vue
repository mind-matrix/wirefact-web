<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col v-if="['MEMBER','MODERATOR','ADMIN'].includes(role)" cols="12" sm="8" md="6" lg="4">
        <w-post-metrics />
      </v-col>
    </v-row>
    <v-alert class="amber darken-2 mt-4" dark>
      More metrics coming soon! ✨
    </v-alert>
  </v-container>
</template>

<script>
import { UserRole } from '~/assets/roles';
import WPostMetrics from "~/components/Metrics/WPostMetrics.vue";
import { ClientService } from '~/service';
export default {
  layout: "auth",
  components: { WPostMetrics },
  data: () => ({
    client: null,
    profile: null
  }),
  computed: {
    role() {
      if (!this.profile) return "Loading...";
      return Object.keys(UserRole).find(
        (role) => UserRole[role] === this.profile.role
      );
    },
  },
  mounted() {
    this.client = new ClientService(this.$store);
    this.client
      .get("profile")
      .then(({ user }) => {
        this.profile = user;
      })
      .catch((err) => {
        console.log("E: ", err.message);
      });
  }
};
</script>
