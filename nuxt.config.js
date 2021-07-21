const axios = require('axios')
const colors = require('vuetify/es5/util/colors').default
const dotenv = require('dotenv')

dotenv.config()

const STATIC_PAGES_SITEMAP = {
    path: "/pages-sitemap.xml",
    exclude: [
        "/reset-password",
        "/profile",
        "/media",
        "/profiles/*",
        "/posts/*",
        "/post/*",
        "/dashboard",
        "/invitation",
        "/statics"
    ],
    routes: [{
            url: "/",
            priority: 1.0
        },
        "login",
        "register",
        "about",
        "about/media",
        "about/profile-picture",
        "about/roadmap",
        "about/roles",
        "about/sponsor",
        "about/candidate/autogen"
    ],
    changefreq: "monthly",
    priority: 0.5
}

module.exports = {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Target: https://go.nuxtjs.dev/config-target
    target: 'server',

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        titleTemplate: '%s | WireFact',
        title: 'Blog',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'The most fascinating and informative educational screen under your fingertips' },
            { hid: 'og:title', property: 'og:title', content: 'WireFact' },
            { hid: 'og:description', property: 'og:description', content: 'The most fascinating and informative educational screen under your fingertips' },
            { hid: 'og:locale', property: 'og:locale', content: 'en_IN' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'crossorigin' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Dosis:wght@600&display=swap' }
        ]
    },

    env: {
        API_URL: process.env.API_URL,
        APP_TOKEN: process.env.APP_TOKEN
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '~/assets/EuclidCircularA-Regular/style.css',
        '~/assets/global.css'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        { src: '~/plugins/tiptap-vuetify', mode: 'client' },
        { src: '~/plugins/vuetify-datetime-picker', mode: 'client' },
        { src: '~/plugins/vuex-persist', ssr: false },
        { src: '~/plugins/vue-masonry', ssr: false },
        { src: '~/plugins/vue-plyr', ssr: false }
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify',
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/pwa
        '@nuxtjs/pwa',
        '@nuxtjs/sitemap',
        'vue-social-sharing/nuxt'
    ],

    // PWA module configuration: https://go.nuxtjs.dev/pwa
    pwa: {
        manifest: {
            lang: 'en'
        }
    },

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            dark: false,
            themes: {
                dark: {
                    primary: colors.blue.darken2,
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                }
            }
        }
    },

    sitemap: async function() {
        const { count } = (await axios.get(`${process.env.API_URL}/posts/count?token=${process.env.APP_TOKEN}`)).data
        const pages = Math.ceil(count / 15)
        const sitemaps = []
        for (let i = 0; i < pages; i += 1) {
            sitemaps.push({
                path: `/blog-posts-sitemap.${i*15}-${i+15}.xml`,
                exclude: [
                    "/",
                    "/*",
                    "/**/*"
                ],
                routes: async() => {
                    const { posts } = (await axios.get(`${process.env.API_URL}/posts?skip=${i*15}&limit=15`)).data
                    return posts.map(post => ({
                        url: `/post/${post.slug}`,
                        lastmod: post.updatedAt,
                        priority: 0.5
                    }))
                },
                changefreq: "daily",
                lastmod: new Date(),
                priority: 0.5,
                gzip: true
            })
        }
        return {
            hostname: "https://wirefact.com",
            sitemaps: [
                STATIC_PAGES_SITEMAP,
                ...sitemaps
            ]
        }
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: ['vuetify/lib', 'tiptap-vuetify', 'vuex-persist', 'text-summarization']
    },

    generate: {
        fallback: true
    }
}