<template>
  <v-card outlined>
    <v-card-title>
      <v-icon>mdi-account</v-icon>
      Accounts
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6" md="3">
          <h1 class="text-body-2">
            Users
            <small class="d-block text-caption"> {{ users }} </small>
          </h1>
        </v-col>
        <v-col cols="6" md="3">
          <h1 class="text-body-2">
            Members
            <small class="d-block text-caption"> {{ members }} </small>
          </h1>
        </v-col>
        <v-col cols="6" md="3">
          <h1 class="text-body-2">
            Moderators
            <small class="d-block text-caption"> {{ moderators }} </small>
          </h1>
        </v-col>
        <v-col cols="6" md="3">
          <h1 class="text-body-2">
            Admins
            <small class="d-block text-caption"> {{ admins }} </small>
          </h1>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { ClientService } from '~/service'

export default {
    props: ['value'],
    data: () => ({
        client: null,
        users: 0,
        members: 0,
        moderators: 0,
        admins: 0
    }),
    async mounted() {
        this.client = new ClientService(this.$store)
        if (this.value) {
          this.users = this.value.users
          this.members = this.value.members
          this.moderators = this.value.moderators
          this.admins = this.admins
        } else {
          this.users = (await this.client.get("metrics/accounts", "user")).count
          this.members = (await this.client.get("metrics/accounts", "member")).count
          this.moderators = (await this.client.get("metrics/accounts", "moderator")).count
          this.admins = (await this.client.get("metrics/accounts", "admin")).count
        }
    }
}
</script>
