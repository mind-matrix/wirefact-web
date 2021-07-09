<template>
  <v-app dark>
    <v-container class="text-center fill-height" fluid>
      <v-row align-content="center" justify="center">
        <v-col cols="12">
          <h1 class="text-h2 grey--text font-weight-thin" v-if="error.statusCode">
            {{ error.statusCode }}
          </h1>
          <h1 class="text-h5">
            {{
              error.statusCode in response
                ? response[error.statusCode.toString()]
                : response.default
            }}
          </h1>
          <NuxtLink to="/" class="text-decoration-none">
            <v-btn outlined color="primary">
              <v-icon>mdi-home</v-icon>
              Run home
            </v-btn>
          </NuxtLink>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>

export default {
  layout: "empty",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      response: {
        default: "Unknown Error.",
        404: "The request page or resource either does not exist or has expired.",
        401: "You are not authorized to access and/or modify this resource.",
        500: "The Server did not respond correctly. Please check back in a while. Contact support if the problem persists.",
        403: "You do not have access to this resource.",
      },
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
