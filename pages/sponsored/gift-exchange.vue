<template>
  <v-container fill-height fluid>
    <v-container v-if="loading" class="loader">
      <div>
        <v-icon size="40" class="gift left">mdi-gift-open</v-icon>
        <v-icon size="40" class="bell">mdi-bell</v-icon>
        <v-icon size="40" class="gift right">mdi-gift</v-icon>
      </div>
      <div class="loading">Gifts loading</div>
    </v-container>
    <v-container v-else-if="allResponses.length">
      <h1>NERIST Gift Exchange Event 2021</h1>
      <pre class="my-2">
Greetings to all,
We, a few students of NERIST, have decided to organize an independent gift exchange program this year. Please fill up the form to get yourself registered.

Participants in a gift exchange, also called Secret Santa, agree to purchase one gift for the recipient they were assigned. In exchange, they will receive a gift from another person selected randomly.
      </pre>
      <v-text-field v-model="query" @input="filterResponses" prepend-inner-icon="mdi-magnify" label="Search" dense solo></v-text-field>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="response in responses"
          :key="response.Timestamp"
        >
          <v-card>
            <v-card-title class="title">
              {{ response["What's your name?"] }}
            </v-card-title>
            <v-card-text>
              <v-img
                @click="openImageDialog(response['What does it look like?'])"
                :aspect-ratio="1 / 1"
                max-width="100%"
                :src="response['What does it look like?']"
              ></v-img>
              <div>
                <div class="title">Comments</div>
                <div @click="openCommentDialog(response)">
                  {{ truncate(response["Comments"], 120) }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="text-center" v-else>
      <div>
        <v-icon size="40" color="amber">mdi-emoticon-sad</v-icon> No responses
        yet.
      </div>
      Why not check out the <a href="/">latest WireFact posts</a> while you wait
      for your friends to respond?
    </v-container>
    <v-dialog v-model="isImageDialogOpen">
      <v-img contain :src="imageDialogValue"></v-img>
    </v-dialog>
    <v-dialog v-model="isCommentDialogOpen">
      <v-card v-if="commentDialogValue">
        <v-card-title>
          {{ commentDialogValue.name }}
        </v-card-title>
        <v-card-subtitle>
          <v-icon>mdi-clock</v-icon> {{ commentDialogValue.time }}
        </v-card-subtitle>
        <v-card-text>
          {{ commentDialogValue.comment }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import csv from "csvtojson";

export default {
  layout: "empty",
  data: () => ({
    loading: true,
    query: null,
    allResponses: [],
    responses: [],
    imageDialogValue: null,
    isImageDialogOpen: false,
    commentDialogValue: null,
    isCommentDialogOpen: false,
  }),
  async mounted() {
    const response = await axios.get(
      "https://docs.google.com/spreadsheets/d/18UByCFDoeCPr0caGK58ZuiXsTJpsxqj_0vH1T6Ffe84/export?format=csv"
    );
    const json = await csv().fromString(response.data);
    const filteredJson = json.filter(
      (record) => record["Timestamp"] && record["Timestamp"].length
    );
    const mappedJson = filteredJson.map((json) => {
      json["What does it look like?"] = this.getImageLink(
        json["What does it look like?"]
      );
      return json;
    });
    this.allResponses = mappedJson;
    this.responses = this.allResponses;
    this.loading = false;
  },
  methods: {
    truncate(input, max) {
      return input.length > max ? `${input.substring(0, max)}...` : input;
    },
    getImageLink(originalUrl) {
      const url = new URL(originalUrl);
      const searchParams = new URLSearchParams(url.search);
      const id = searchParams.get("id");
      if (id) {
        return `https://drive.google.com/uc?id=${id}`;
      } else {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' style='enable-background:new 0 0 60 60' viewBox='0 0 60 60'%3E%3Cpath d='M53 22.2a10.5 10.5 0 0 0-15.5-8 15.4 15.4 0 0 0-13-7.2c-6.8 0-12.8 4.6-14.8 11.3A12.5 12.5 0 0 0 9 42.5a8.5 8.5 0 0 0 14.7 5.8 12.6 12.6 0 0 0 21.1-2.6l2.7.3a12.5 12.5 0 0 0 5.4-23.8zM47.4 44c-1 0-2-.1-3-.4a1 1 0 0 0-1.2.6A10.5 10.5 0 0 1 24.6 46a1 1 0 0 0-.8-.5 1 1 0 0 0-.9.5A6.5 6.5 0 0 1 11 41.8c0-.5-.3-1-.7-1-4.8-1-8.3-5.4-8.3-10.3 0-5.1 3.6-9.4 8.6-10.3.4-.1.7-.4.8-.8C13 13.3 18.4 9 24.5 9c4.9 0 9.4 2.7 11.8 7.1a1 1 0 0 0 1.4.4A8.5 8.5 0 0 1 51 23c0 .3.2.7.6.8A10.5 10.5 0 0 1 47.5 44z'/%3E%3Cpath d='M33.5 35h-1c-1 0-1.9.4-2.5 1-.6-.6-1.5-1-2.5-1h-1c-2 0-3.5 1.6-3.5 3.5V40h2v-1.5c0-.8.7-1.5 1.5-1.5h1c.8 0 1.5.7 1.5 1.5V42h2v-3.5c0-.8.7-1.5 1.5-1.5h1c.8 0 1.5.7 1.5 1.5V42h2v-3.5c0-2-1.6-3.5-3.5-3.5z'/%3E%3Ccircle cx='37' cy='27' r='2'/%3E%3Ccircle cx='23' cy='27' r='2'/%3E%3Cpath d='M29 27a6 6 0 1 0-12 0 6 6 0 0 0 12 0zm-10 0a4 4 0 1 1 8 0 4 4 0 0 1-8 0zm18-6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z'/%3E%3C/svg%3E";
      }
    },
    openImageDialog(imgUrl) {
      this.imageDialogValue = imgUrl;
      this.isImageDialogOpen = true;
    },
    openCommentDialog(resource) {
      this.commentDialogValue = {
        name: resource["What's your name?"],
        time: resource["Timestamp"],
        comment: resource["Comments"],
      };
      this.isCommentDialogOpen = true;
    },
    filterResponses() {
        if (this.query) {
            const regex = new RegExp(this.query, "i")
            this.responses = this.allResponses.filter(response => regex.test(response["What's your name?"]))
        }
    }
  },
};
</script>

<style scoped>
pre {
  font-family: inherit;
  max-width: 100%;
  margin: 10px;
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}

.title {
  word-break: normal !important;
  hyphens: auto;
}

.loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.loading:after {
  content: ".";
  animation: loading 1s ease alternate infinite;
}

@keyframes loading {
  60% {
    text-shadow: 0.35em 0 0 currentColor;
  }
  100% {
    text-shadow: 0.35em 0 0 currentColor, 0.75em 0 0 currentColor;
  }
}

.bell {
  color: #fbc02d;
  -webkit-animation: ring 4s 0.7s ease-in-out infinite;
  -webkit-transform-origin: 50% 4px;
  -moz-animation: ring 4s 0.7s ease-in-out infinite;
  -moz-transform-origin: 50% 4px;
  animation: ring 4s 0.7s ease-in-out infinite;
  transform-origin: 50% 4px;
}

.gift.left {
  color: #f44336;
}

.gift.right {
  color: #66bb6a;
}

@-webkit-keyframes ring {
  0% {
    -webkit-transform: rotateZ(0);
  }
  1% {
    -webkit-transform: rotateZ(30deg);
  }
  3% {
    -webkit-transform: rotateZ(-28deg);
  }
  5% {
    -webkit-transform: rotateZ(34deg);
  }
  7% {
    -webkit-transform: rotateZ(-32deg);
  }
  9% {
    -webkit-transform: rotateZ(30deg);
  }
  11% {
    -webkit-transform: rotateZ(-28deg);
  }
  13% {
    -webkit-transform: rotateZ(26deg);
  }
  15% {
    -webkit-transform: rotateZ(-24deg);
  }
  17% {
    -webkit-transform: rotateZ(22deg);
  }
  19% {
    -webkit-transform: rotateZ(-20deg);
  }
  21% {
    -webkit-transform: rotateZ(18deg);
  }
  23% {
    -webkit-transform: rotateZ(-16deg);
  }
  25% {
    -webkit-transform: rotateZ(14deg);
  }
  27% {
    -webkit-transform: rotateZ(-12deg);
  }
  29% {
    -webkit-transform: rotateZ(10deg);
  }
  31% {
    -webkit-transform: rotateZ(-8deg);
  }
  33% {
    -webkit-transform: rotateZ(6deg);
  }
  35% {
    -webkit-transform: rotateZ(-4deg);
  }
  37% {
    -webkit-transform: rotateZ(2deg);
  }
  39% {
    -webkit-transform: rotateZ(-1deg);
  }
  41% {
    -webkit-transform: rotateZ(1deg);
  }

  43% {
    -webkit-transform: rotateZ(0);
  }
  100% {
    -webkit-transform: rotateZ(0);
  }
}

@-moz-keyframes ring {
  0% {
    -moz-transform: rotate(0);
  }
  1% {
    -moz-transform: rotate(30deg);
  }
  3% {
    -moz-transform: rotate(-28deg);
  }
  5% {
    -moz-transform: rotate(34deg);
  }
  7% {
    -moz-transform: rotate(-32deg);
  }
  9% {
    -moz-transform: rotate(30deg);
  }
  11% {
    -moz-transform: rotate(-28deg);
  }
  13% {
    -moz-transform: rotate(26deg);
  }
  15% {
    -moz-transform: rotate(-24deg);
  }
  17% {
    -moz-transform: rotate(22deg);
  }
  19% {
    -moz-transform: rotate(-20deg);
  }
  21% {
    -moz-transform: rotate(18deg);
  }
  23% {
    -moz-transform: rotate(-16deg);
  }
  25% {
    -moz-transform: rotate(14deg);
  }
  27% {
    -moz-transform: rotate(-12deg);
  }
  29% {
    -moz-transform: rotate(10deg);
  }
  31% {
    -moz-transform: rotate(-8deg);
  }
  33% {
    -moz-transform: rotate(6deg);
  }
  35% {
    -moz-transform: rotate(-4deg);
  }
  37% {
    -moz-transform: rotate(2deg);
  }
  39% {
    -moz-transform: rotate(-1deg);
  }
  41% {
    -moz-transform: rotate(1deg);
  }

  43% {
    -moz-transform: rotate(0);
  }
  100% {
    -moz-transform: rotate(0);
  }
}

@keyframes ring {
  0% {
    transform: rotate(0);
  }
  1% {
    transform: rotate(30deg);
  }
  3% {
    transform: rotate(-28deg);
  }
  5% {
    transform: rotate(34deg);
  }
  7% {
    transform: rotate(-32deg);
  }
  9% {
    transform: rotate(30deg);
  }
  11% {
    transform: rotate(-28deg);
  }
  13% {
    transform: rotate(26deg);
  }
  15% {
    transform: rotate(-24deg);
  }
  17% {
    transform: rotate(22deg);
  }
  19% {
    transform: rotate(-20deg);
  }
  21% {
    transform: rotate(18deg);
  }
  23% {
    transform: rotate(-16deg);
  }
  25% {
    transform: rotate(14deg);
  }
  27% {
    transform: rotate(-12deg);
  }
  29% {
    transform: rotate(10deg);
  }
  31% {
    transform: rotate(-8deg);
  }
  33% {
    transform: rotate(6deg);
  }
  35% {
    transform: rotate(-4deg);
  }
  37% {
    transform: rotate(2deg);
  }
  39% {
    transform: rotate(-1deg);
  }
  41% {
    transform: rotate(1deg);
  }

  43% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(0);
  }
}
</style>
