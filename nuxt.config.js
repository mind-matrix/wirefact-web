import axios from 'axios'
import colors from 'vuetify/es5/util/colors'

const API_ENDPOINT = "https://api.wirefact.com"

export default {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Target: https://go.nuxtjs.dev/config-target
    target: 'static',

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        titleTemplate: '%s | WireFact',
        title: 'Blog',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'The most fascinating and informative educational screen under your fingertips' },
            { hid: 'og:title', name: 'og:title', content: 'WireFact' },
            { hid: 'og:description', name: 'og:title', content: 'The most fascinating and informative educational screen under your fingertips' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },

    env: {
        API: API_ENDPOINT
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
        { src: '~/plugins/vue-masonry', ssr: false }
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
        // https://go.nuxtjs.dev/content
        '@nuxt/content',
        '@nuxtjs/sitemap'
    ],

    // PWA module configuration: https://go.nuxtjs.dev/pwa
    pwa: {
        manifest: {
            lang: 'en'
        }
    },

    // Content module configuration: https://go.nuxtjs.dev/config-content
    content: {},

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

    sitemap: {
        hostname: "https://wirefact.com",
        sitemaps: [{
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
        }, {
            path: "/blog-posts-sitemap.xml",
            exclude: [
                "/",
                "/*",
                "/**/*"
            ],
            routes: async() => {
                const { posts } = (await axios.get(`${API_ENDPOINT}/posts?skip=0&limit=50000`)).data
                return posts.map(post => `/post/${post.id}`)
            },
            changefreq: "daily",
            lastmod: new Date(),
            priority: 0.5,
            gzip: true
        }]
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: ['vuetify/lib', 'tiptap-vuetify', 'vuex-persist', 'text-summarization']
    },

    generate: {
        fallback: true
    }
}