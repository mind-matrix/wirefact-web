<template>
    <v-list-item link :to="`/profile/${username}`">
        <v-list-item-avatar>
            <v-avatar>
                <v-img :src="gravatar" max-width="25" max-height="25"></v-img>
            </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title>{{ name }}</v-list-item-title>
            <v-list-item-subtitle>@{{ username }}</v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
export default {
    props: ["name","username","gravatar"]
}
</script>
