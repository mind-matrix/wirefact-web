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
import { UserRole } from '~/assets/roles'
import { ClientService } from '~/service'
export default {
    data: () => ({
        client: null,
        profile: null
    }),
    computed: {
        role() {
            if (!this.profile) return 'Loading...'
            return Object.keys(UserRole).find(role => UserRole[role] === this.profile.role)
        }
    },
    mounted() {
        this.client = new ClientService(this.$store)
        let { username } = this.$route.params
        this.client.get("profile", username).then(({ user }) => {
            console.log(user)
            this.profile = user
        })
    }
}
</script>
