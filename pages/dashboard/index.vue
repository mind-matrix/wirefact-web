<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <w-post-metrics v-if="['MEMBER','MODERATOR','ADMIN'].includes(role)" />
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
export default {
  layout: "auth",
  components: { WPostMetrics },
  computed: {
    role() {
      if (!this.profile) return "Loading...";
      return Object.keys(UserRole).find(
        (role) => UserRole[role] === this.profile.role
      );
    },
  },
};
</script>
