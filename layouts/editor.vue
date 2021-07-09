<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app temporary>
      <v-list>
        <template v-for="(item, i) in items">
          <v-menu v-if="item.children" :key="i" offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title" />
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in item.children"
                :key="index"
                :to="item.to"
                router
                exact
                ><v-list-item-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-list-item v-else :key="i" :to="item.to" router exact>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <v-btn v-if="$store.state.token" @click="signout" text color="red" absolute bottom block tile elevation="0" style="bottom: 0;">
        sign out
      </v-btn>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <Nuxt />
        <w-notify></w-notify>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { LINKS } from '~/assets/links';
import WNotify from "~/components/WNotify.vue";

export default {
  components: {
    WNotify
  },
  data () {
    return {
      drawer: false,
      items: LINKS
    }
  },
  mounted() {
      this.$nuxt.$on("toggle-sidebar", () => {
          this.drawer = !this.drawer
      });
  },
  methods: {
    signout() {
      this.$store.commit("deauth")
      this.$router.replace("/login")
    },
  }
}
</script>
