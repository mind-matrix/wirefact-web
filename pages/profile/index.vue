<template>
  <v-container v-if="profile" fluid>
    <v-avatar class="d-block mx-auto" max-width="200">
      <v-img contain :src="profile.gravatar"></v-img>
    </v-avatar>
    <v-card flat>
      <v-card-title class="d-block text-center">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-if="editName"
              style="max-width: 300px"
              class="d-inline-block mx-auto"
              outlined
              dense
              v-model="profileName"
              placeholder="Enter a name"
              append-icon="mdi-floppy"
              @click:append="saveProfileName"
            ></v-text-field>
            <span v-else>{{ profile.name }}</span>
            <v-btn x-small @click="editName = !editName" icon>
              <v-icon>
                {{ editName ? "mdi-close" : "mdi-pen" }}
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-chip>{{ role }}</v-chip>
          </v-col>
        </v-row>
        <v-row dense class="text-center text-body-1">
          <v-col cols="12">
            <v-icon>mdi-email</v-icon>
            {{ profile.email }}
            <v-btn x-small @click="toggleEmailPublic" icon>
              <v-icon>
                {{ profile.privacy.emailPublic ? "mdi-eye" : "mdi-eye-off" }}
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-if="editPhone"
              style="max-width: 300px"
              class="d-inline-block mx-auto"
              outlined
              dense
              v-model="profilePhone"
              placeholder="Enter your phone no."
              append-icon="mdi-floppy"
              @click:append="savePhone"
            ></v-text-field>
            <span v-else>
              <v-icon>mdi-phone</v-icon>
              {{ profile.phone || "N/A" }}
            </span>
            <v-btn x-small @click="editPhone = !editPhone" icon>
              <v-icon>
                {{ editPhone ? "mdi-close" : "mdi-pen" }}
              </v-icon>
            </v-btn>
            <v-btn x-small @click="togglePhonePublic" icon>
              <v-icon>
                {{ profile.privacy.phonePublic ? "mdi-eye" : "mdi-eye-off" }}
              </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-icon>mdi-account</v-icon>
            {{ profile.username }}
          </v-col>
        </v-row>
        <v-row dense class="mt-4 text-body-1">
          <v-col cols="12" class="ba-1">
            <v-btn link to="/about/profile-picture" text outlined>
              Change my profile picture
            </v-btn>
          </v-col>
          <v-col cols="12" class="ba-1">
            <v-btn @click="requestResetPassword" text outlined>
              Reset my password
            </v-btn>
          </v-col>
        </v-row>
        <v-row dense class="mt-4 text-body-1" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <w-post-metrics v-if="['MEMBER','MODERATOR','ADMIN'].includes(role)" />
          </v-col>
        </v-row>
      </v-card-title>
    </v-card>
    <v-snackbar
      color="transparent"
      v-model="notify"
      :timeout="20000"
      elevation="0"
      top
      left
    >
      <v-alert :color="notifyColor">
        {{ notifyText }}
      </v-alert>
    </v-snackbar>
  </v-container>
</template>

<script>
import { UserRole } from "~/assets/roles";
import WPostMetrics from "~/components/Metrics/WPostMetrics.vue";
import { ClientService } from "~/service";
export default {
  components: { WPostMetrics },
  data: () => ({
    client: null,
    profile: null,
    editName: false,
    editPhone: false,
    profileName: null,
    profilePhone: null,
    notify: false,
    notifyText: null,
    notifyColor: "amber",
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
        this.profileName = user.name;
        this.profilePhone = user.phone;
      })
      .catch((err) => {
        console.log("E: ", err.message);
      });
  },
  methods: {
    async updateProfile(data) {
      return await this.client.put("profile", null, data);
    },
    saveProfileName() {
      let name = this.profileName;
      this.updateProfile({ name })
        .then(({ user }) => {
          this.profile = user;
          this.editName = false;
        })
        .catch((err) => {
          console.log("E: ", err.message);
        });
    },
    savePhone() {
      let phone = this.profilePhone;
      this.updateProfile({ phone })
        .then(({ user }) => {
          this.profile = user;
          this.editPhone = false;
        })
        .catch((err) => {
          console.log("E: ", err.message);
        });
    },
    togglePhonePublic() {
      this.profile.privacy.phonePublic = !this.profile.privacy.phonePublic;
      this.updateProfile({ privacy: this.profile.privacy }).then(({ user }) => {
        this.profile = user;
      });
    },
    toggleEmailPublic() {
      this.profile.privacy.emailPublic = !this.profile.privacy.emailPublic;
      this.updateProfile({ privacy: this.profile.privacy }).then(({ user }) => {
        this.profile = user;
      });
    },
    requestResetPassword() {
      this.client
        .get("reset-password", this.profile.username)
        .then(() => {
          this.notifyText = `An email has been sent to ${this.profile.email} for updating the password. Please also check the spam folder for the email. 📧`
          this.notifyColor = "amber"
          this.notify = true
        })
        .catch((err) => {
          console.log("E: ", err.message);
        });
    },
  },
};
</script>
