<template>
  <v-container v-if="profile" fluid>
    <v-avatar class="d-block mx-auto" max-width="200">
      <v-img contain :src="profile.gravatar"></v-img>
    </v-avatar>
    <v-card flat>
      <v-card-title class="d-block text-center">
        <v-row>
          <v-col cols="12">
            {{ profile.name }}
          </v-col>
          <v-col cols="12">
            <v-chip>{{ role }}</v-chip>
          </v-col>
        </v-row>
        <v-row dense class="text-center text-body-1">
          <v-col v-if="profile.email" cols="12">
            <v-icon>mdi-email</v-icon>
            {{ profile.email }}
          </v-col>
          <v-col v-if="profile.phone" cols="12">
            <v-icon>mdi-phone</v-icon>
            {{ profile.phone }}
          </v-col>
          <v-col cols="12">
            <v-icon>mdi-account</v-icon>
            {{ profile.username }}
          </v-col>
        </v-row>
      </v-card-title>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import { UserRole } from "~/assets/roles";
export default {
  async asyncData({ route }) {
    let { user } = (
      await axios.get(`${process.env.API}/profile/${route.params.username}`)
    ).data;
    return { profile: user };
  },
  head() {
    return {
      title: this.profile.name,
      meta: [
        { hid: 'og:title', property: 'og:title', content: this.profile.name },
        { hid: 'og:image', property: 'og:image', content: this.profile.gravatar },
        { hid: 'og:url', property: 'og:url', content: `https://wirefact.com/profile/${this.profile.username}` }
      ]
    }
  },
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
