<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" fixed app temporary>
      <v-list>
        <template v-for="(item, i) in items">
          <v-menu
            v-if="
              (!item.auth || $store.state.token) &&
              (item.role === undefined ||
                $store.state.user.role >= item.role) &&
              item.children
            "
            :key="i"
            offset-x
          >
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
              <template v-for="(item, index) in item.children">
                <v-list-item
                  v-if="
                    (!item.auth || $store.state.token) &&
                    (item.role === undefined ||
                      $store.state.user.role >= item.role)
                  "
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
              </template>
            </v-list>
          </v-menu>
          <v-list-item
            v-else-if="
              (!item.auth || $store.state.token) &&
              (item.role === undefined || $store.state.user.role >= item.role)
            "
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <v-btn
        v-if="$store.state.token"
        @click="signout"
        text
        color="red"
        absolute
        bottom
        block
        tile
        elevation="0"
        style="bottom: 0"
      >
        sign out
      </v-btn>
    </v-navigation-drawer>
    <v-app-bar elevate-on-scroll class="white" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="titles[currentTitle]" />
      <v-spacer></v-spacer>
      <template v-if="$store.state.token">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar v-on="on" v-bind="attrs">
              <v-img :src="$store.state.user.gravatar"></v-img>
            </v-avatar>
          </template>
          <v-list>
            <template v-for="(item, index) in quickLinks">
              <v-list-item
                v-if="
                  (!item.auth || $store.state.token) &&
                  (item.role === undefined ||
                    $store.state.user.role >= item.role)
                "
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
            </template>
            <v-list-item class="text-center" @click="signout">
              <v-list-item-content>
                <v-list-item-title class="red--text"
                  >Sign Out</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
        <w-notify></w-notify>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { LINKS, QUICK_LINKS } from "~/assets/links";
import WNotify from "~/components/WNotify.vue";

export default {
  components: {
    WNotify
  },
  data() {
    return {
      drawer: false,
      items: LINKS,
      quickLinks: QUICK_LINKS,
      titles: [
        "WireFact",
        "I'm just a title",
        "...Just a lonely title",
        "Anyways...*Ahem*",
      ],
      currentTitle: 0,
    };
  },
  created() {
    if (!this.$store.state.token) {
      this.$router.replace("/login");
    }
  },
  mounted() {
    setTimeout(() => {
      setInterval(() => {
        this.currentTitle++;
        if (this.currentTitle === this.titles.length) this.currentTitle = 0;
      }, 5 * 1000);
    }, 20 * 60 * 1000);
  },
  methods: {
    signout() {
      this.$store.commit("deauth");
      this.$router.replace("/login");
    },
    signin() {
      this.$router.push("/login");
    },
    signup() {
      this.$router.push("/register");
    },
  },
};
</script>
