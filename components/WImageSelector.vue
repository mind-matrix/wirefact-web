<template>
    <v-card>
        <v-card-text>
            <w-media-gallery v-model="selection" :multiple="false"></w-media-gallery>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        selection: null
    }),
    watch: {
        selections: {
            handler(val) {
                if (!this.selection) return
                this.$emit("select-file", { src: `https://wirefact-media.s3.ap-south-1.amazonaws.com/${this.selection.key}`, alt: this.selection.metadata.alt || this.selection.filename })
            }
        }
    }
}
</script>
