<template>
  <v-container v-if="invitation" fluid>
    <v-card class="mx-auto" max-width="640">
      <v-card-title>Invitation from WireFact ✨</v-card-title>
      <v-card-text>
        <p>Hi, {{ invitation.name }}</p>
        <p>
          You are invited to join WireFact as a
          <v-chip tag="span">{{ role }}</v-chip
          >. We hope you have a great time exploring WireFact.
        </p>
        <p>
          Your email address is <strong>{{ invitation.email }}</strong>
        </p>
        <p>
          Your username has been set to
          <strong>{{ invitation.username }}</strong>
        </p>
        <p>To get started, please enter a password for your account</p>
        <v-form>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                type="password"
                v-model="password"
                label="Password"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="password"
                v-model="confirmPassword"
                label="Confirm Password"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="text-right">
              <v-btn
                :disabled="password && password.trim().length && password !== confirmPassword"
                @click="submit"
                color="primary"
                elevation="0"
                >create account</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
        <p class="mt-4">
          Wish to change the default details provided by the admin?
          <a href="/register">Manually create an account</a>
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { UserRole } from "~/assets/roles";
import { ClientService } from "~/service";
export default {
  data: () => ({
    client: null,
    invitation: null,
    password: null,
    confirmPassword: null,
  }),
  computed: {
    role() {
      if (!this.invitation) return "Loading...";
      return Object.keys(UserRole).find(
        (role) => UserRole[role] === this.invitation.role
      );
    },
  },
  mounted() {
    let { code } = this.$route.params;
    this.client = new ClientService(this.$store);
    this.client
      .get("invitation", code)
      .then(({ invitation }) => {
        this.invitation = invitation;
      })
      .catch((err) => {
          this.$nuxt.error({ statusCode: err.response.status })
      });
  },
  methods: {
    submit() {
      this.client
        .put("invitation", this.invitation.code, { password: this.password })
        .then(() => {
          this.$router.push("/login");
        })
        .catch((err) => {
          console.log("E: ", err.message, err.response);
        });
    },
  },
};
</script>
