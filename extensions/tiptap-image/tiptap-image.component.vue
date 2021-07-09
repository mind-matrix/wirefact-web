<template>
    <div class="tiptap-custom-image-container">
        <vue-draggable-resizable style="position: relative; margin: 0 auto;" :w="width" :h="height" :data-id="dataId" :data-key="dataKey" @resizestop="onResize" :draggable="false" :lock-aspect-ratio="true">
            <div :style="`background-image:url('${src}');background-size:cover;background-repeat:no-repeat;position:absolute;top:0;left:0;right:0;bottom:0;`"></div>
        </vue-draggable-resizable>
    </div>
</template>
<script>
import VueDraggableResizable from 'vue-draggable-resizable';
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
export default {
    props: ['node', 'updateAttrs', 'view', 'selected', 'getPos', 'options'],
    components: {
        'vue-draggable-resizable': VueDraggableResizable
    },
    computed: {
        src: {
            get() {
                return this.node.attrs.src;
            },
            set(src) {
                this.updateAttrs({src});
            }
        },
        width: {
            get() {
                return parseInt(this.node.attrs.width);
            },
            set(width) {
                this.updateAttrs({
                    width: width
                });
            }
        },
        height: {
            get() {
                return parseInt(this.node.attrs.height);
            },
            set(height) {
                this.updateAttrs({
                    height: height
                });
            }
        },
        dataId: {
            get() {
                return this.node.attrs.dataId;
            },
            set(dataId) {
                this.updateAttrs({ dataId });
            }
        },
        dataKey: {
            get() {
                return this.node.attrs.dataKey;
            },
            set(dataId) {
                this.updateAttrs({ dataKey });
            }
        }
    },
    methods: {
        onResize(x, y, width, height) {
            this.width = width;
            this.height = height;
        }
    }
}
</script>