<template>
    <v-textarea v-model="content" outlined placeholder="Write your comment here..."></v-textarea>
</template>

<script>
export default {
    data: () => ({
        content: null
    })
}
</script>
