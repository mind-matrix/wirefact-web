<template>
    <vue-plyr>
        <audio controls crossorigin playsinline>
            <source
                :src="src"
                type="audio/mp3"
            />
        </audio>
    </vue-plyr>
</template>

<script>
export default {
    props: ["src"]
}
</script>
