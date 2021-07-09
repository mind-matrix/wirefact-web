<template>
    <v-container v-if="image" class="ma-0 pa-0">
        <v-skeleton-loader
        v-if="!loaded"
        tile
        :width="Math.max(width ? width : 0, minWidth ? minWidth : 0)"
        :height="Math.max(width ? width : 0, minWidth ? minWidth : 0) * image.metadata.height/image.metadata.width"
        :max-width="maxWidth"
        :max-height="(maxWidth === undefined || maxWidth === null) ? undefined : maxWidth * image.metadata.height/image.metadata.width"
        type="image"
        ></v-skeleton-loader>
        <v-hover v-else v-slot="{ hover }">
            <v-img
                v-ripple="{ center: true }"
                :class="['pa-0', elevation ? `elevation-${elevation}` : '', 'ma-0', background ? background : 'grey lighten-3']"
                :style="{ margin: (align === 'center') ? '0 auto !important' : '0', cursor: 'pointer' }"
                @click="onClick"
                contain
                :src="src"
                :width="width"
                :min-width="minWidth"
                :max-width="maxWidth"
                :max-height="maxHeight"
                :aspect-ratio="image.metadata.width/image.metadata.height"
                :alt="image.metadata.alt || image.filename"
            >
                <slot></slot>
                <slot name="hover" v-if="hover"></slot>
            </v-img>
        </v-hover>
    </v-container>
</template>

<script>
import { ClientService } from "~/service"

export default {
    props: ['id','value','width','min-width','max-width', 'max-height', 'elevation', 'align', 'background'],
    data: () => ({
        client: null,
        image: null,
        loaded: false,
        src: null
    }),
    mounted() {
        if (this.id) {
            this.client = new ClientService(this.$store)
            this.client.get("media", this.id).then(({ media }) => {
                this.image = media
                this.loadImage()
            }).catch((err) => {
                console.log(err)
            })
        } else if (this.value) {
            this.image = this.value
            this.loadImage()
        }
    },
    methods: {
        loadImage() {
            let imgEl = new Image()
            imgEl.onload = () => {
                this.src = imgEl.src
                this.loaded = true
                this.$emit("loadeddata")
            }
            imgEl.src = `https://wirefact-media.s3.ap-south-1.amazonaws.com/${this.image.key}`
        },
        onClick() {
            this.$emit("click")
        }
    }
}
</script>
