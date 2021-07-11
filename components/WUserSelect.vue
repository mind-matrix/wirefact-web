<template>
  <v-container fluid>
    <v-row>
      <v-col class="col">
        <v-container fluid class="ma-0 selection">
          <template v-if="selection">
            <v-img
              class="d-inline"
              :max-height="25"
              :max-width="25"
              width="auto"
              contain
              :src="selection.gravatar"
            ></v-img>
            <span>{{ selection.name }}</span>
          </template>
          <span v-else>Choose an account</span>
        </v-container>
      </v-col>
      <v-col @click="dialog = true" class="col" cols="auto">
        <v-btn tile class="ma-0 grey lighten-3" outlined text> select </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" max-width="640">
      <v-card>
        <v-card-title>
          <v-text-field
            @keyup.enter="search"
            @click:append="search"
            dense
            outlined
            v-model="query"
            label="Search"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-list v-if="users.length">
            <v-list-item-group v-model="selectionIndex">
              <v-list-item v-for="user of users" :key="user.id">
                <v-list-item-avatar>
                  <v-img
                    :max-height="50"
                    width="auto"
                    contain
                    :src="user.gravatar"
                  ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ user.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          <v-container v-else class="text-center" fluid>
              No results. Type some more or try again.
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" outlined text color="grey lighten-3">
            cancel
          </v-btn>
          <v-btn @click="select" outlined text color="primary"> select </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { ClientService } from "~/service";
export default {
  props: ["value"],
  data: () => ({
    selection: null,
    selectionIndex: null,
    dialog: false,
    query: null,
    users: [],
    client: null,
  }),
  mounted() {
    this.selection = this.value;
    this.client = new ClientService(this.$store);
    if (this.selection) {
      this.query = this.selection.email;
      this.search();
    }
  },
  methods: {
    search() {
      this.client
        .get(`profiles?q=${this.query}`)
        .then(({ users }) => {
          this.users = users;
        })
        .catch((err) => {
          console.log("E: ", err.message, err.response);
        });
    },
    select() {
      if (this.selectionIndex >= this.users.length) return;
      this.selection = this.users[this.selectionIndex];
      this.$emit("input", this.selection);
      this.dialog = false;
    },
  },
  watch: {
    value: {
      handler(val) {
        if (val === this.selection) return;
        this.selection = val;
        if (this.selection) {
          this.query = this.selection.email;
          this.search();
        }
      },
    },
  },
};
</script>

<style scoped>
.selection {
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  font-weight: 500;
  letter-spacing: 0.0892857143em;
  justify-content: center;
  outline: 0;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.12);
  height: 36px;
}
.selection > span {
  align-items: center;
  color: inherit;
  display: flex;
  flex: 1 0 auto;
  justify-content: inherit;
  line-height: normal;
  position: relative;
  transition: inherit;
  transition-property: opacity;
}
.col {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
