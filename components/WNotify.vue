<template>
    <v-snackbar app top left v-model="snackbar" :color="color" :timeout="timeout">
        {{ message }}
    </v-snackbar>
</template>

<script>

const DEFAULTS = {
    color: "red",
    timeout: 5 * 1000,
    message: "You have a notification"
}

export default {
    data: () => ({
        color: DEFAULTS.color,
        timeout: DEFAULTS.timeout,
        message: DEFAULTS.message,
        snackbar: false
    }),
    mounted() {
        this.$nuxt.$on("notify", ({ color, timeout, message }) => {
            
            if (color !== undefined) this.color = color
            else this.color = DEFAULTS.color

            if (timeout !== undefined) this.timeout = timeout
            else this.timeout = DEFAULTS.timeout

            if (message !== undefined) this.message = message
            else this.message = DEFAULTS.message

            this.snackbar = true
        })
    }
}
</script>
