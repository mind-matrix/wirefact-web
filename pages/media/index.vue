<template>
    <v-container class="pa-0" fluid>
        <w-media-gallery :show-usage="true"></w-media-gallery>
    </v-container>
</template>

<script>
import WMediaGallery from "~/components/WMediaGallery.vue"

export default {
    layout: "auth",
    head: {
        title: "Gallery"
    },
    components: {
        WMediaGallery
    }
}
</script>
