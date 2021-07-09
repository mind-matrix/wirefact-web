<template>
    <v-app>
        <v-main>
            <v-container class="fill-height" fluid>
                <Nuxt />
                <w-notify></w-notify>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import WNotify from "~/components/WNotify.vue";

export default {
    components: {
        WNotify
    }
}
</script>
