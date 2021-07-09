<template>
    <v-container fluid>
        <v-card max-width="640" outlined class="mx-auto">
            <v-card-title>Statics</v-card-title>
            <v-card-text>
                <v-form>
                    <v-row>
                        <v-col cols="12">
                            Configuration
                        </v-col>
                        <v-col v-if="config.length" cols="12">
                            <v-row v-for="(item, index) in config" :key="index" dense>
                                <v-col>
                                    <v-text-field label="Key" v-model="item.key" outlined dense></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="Value" v-model="item.value" outlined dense></v-text-field>
                                </v-col>
                                <v-col cols="auto">
                                    <v-btn @click="removeField(index)" icon>
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col v-else cols="12" class="text-center">
                            No fields in configuration
                        </v-col>
                        <v-col cols="12" class="text-right">
                            <v-btn @click="addConfigField" color="primary" outlined>
                                <v-icon>mdi-plus</v-icon>
                                add field
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="save" color="success" elevation="0">
                    <v-icon>mdi-floppy</v-icon>
                    save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import { ClientService } from '~/service'
export default {
    layout: "auth",
    data: () => ({
        client: null,
        config: [],

    }),
    mounted() {
        this.client = new ClientService(this.$store)
        this.client.get("_statics").then(({ config, announcements }) => {
            this.config = Object.keys(config).map(key => ({ key, value: config[key] }))
        }).catch((err) => {
            console.log("E: ", err.message, err.response)
        })
    },
    methods: {
        addConfigField() {
            this.config.push({ key: null, value: null })
        },
        removeField(index) {
            this.config.splice(index, 1)
        },
        save() {
            let config = {}
            console.log(this.config)
            for (let field of this.config) {
                if (field.key && field.value && field.key.trim().length) config[field.key] = field.value
            }
            console.log(config)
            this.client.put("_statics", null, { config }).then((response) => {
                console.log(response)
            }).catch((err) => {
                console.log("E: ", err.message, err.response)
            })
        }
    }
}
</script>
