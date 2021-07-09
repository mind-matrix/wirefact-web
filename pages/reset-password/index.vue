<template>
  <v-card max-width="640" class="mx-auto">
    <v-card-title>Password Reset</v-card-title>
    <v-card-text>
      <v-container v-if="!sent" class="ma-0 pa-0" fluid>
        <v-text-field
          v-model="identifier"
          label="Enter username/email"
          outlined
          dense
        ></v-text-field>
        <v-btn @click="submit" elevation="0" color="primary"> send email </v-btn>
      </v-container>
      <v-container v-else class="ma-0 pa-0 text-center" fluid>
        An email has been delivered to your register email address. Please visit
        the link provided in the email to reset your password.
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { ClientService } from "~/service";
export default {
  data: () => ({
    client: null,
    identifier: null,
    sent: false,
  }),
  mounted() {
    this.client = new ClientService(this.$store);
  },
  methods: {
    submit() {
      this.client
        .get("reset-password", this.identifier)
        .then((response) => {
          this.sent = true;
        })
        .catch((err) => {
          this.$nuxt.error({ statusCode: 404 });
        });
    },
  },
};
</script>
