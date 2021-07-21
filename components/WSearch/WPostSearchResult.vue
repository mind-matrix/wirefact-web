<template>
    <v-list-item link :to="`/post/${id}`">
        <v-list-item-content>
            {{ title }}
        </v-list-item-content>
    </v-list-item>
</template>

<script>
export default {
    props: ["id","slug","title"]
}
</script>
