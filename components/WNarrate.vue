<template>
    <v-container fluid>
        <v-card v-bind="styleProps" tile>
            <v-card-text>
                <v-row>
                    <v-col v-if="poster" class="mx-auto" cols="auto">
                        <v-img max-width="200" max-height="200" :src="`https://wirefact-media.s3.ap-south-1.amazonaws.com/${poster.key}`"></v-img>
                    </v-col>
                    <v-col v-if="narration">
                        <v-row>
                            <v-col cols="12">
                                <vue-plyr>
                                    <audio :src="`https://wirefact-media.s3.ap-south-1.amazonaws.com/${narration[voice]}`" type="audio/mp3" controls crossorigin playsinline></audio>
                                </vue-plyr>
                            </v-col>
                            <v-col v-if="title" cols="12">
                                <h2>
                                    {{ title }}
                                </h2>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="auto">
                        Listen in the voice of,
                        <v-select outlined dense label="Voice" v-model="voice" :items="voices" item-text="name" item-value="value"></v-select>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    props: ["narration","poster","title","styleProps"],
    data: () => ({
        voice: "female",
        voices: [
            { name: "Matthews (Male)", value: "male" },
            { name: "Joanne (Female)", value: "female" }
        ]
    }),
    methods: {
        toggleVoice() {
            if (this.voice === "female") this.voice = "male"
            else this.voice = "female"
        }
    }
}
</script>
