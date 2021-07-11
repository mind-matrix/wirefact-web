import { UserRole } from "./roles";

export const LINKS = [{
        icon: "mdi-home",
        title: "Home",
        to: "/",
        auth: false
    }, {
        icon: "mdi-apps",
        title: "Dashboard",
        to: "/dashboard",
        auth: true,
        role: UserRole.USER
    },
    {
        icon: "mdi-image",
        title: "Gallery",
        to: "/media",
        auth: true,
        role: UserRole.MEMBER
    },
    {
        icon: "mdi-file",
        title: "Posts",
        to: "/posts",
        children: [{
                icon: "mdi-plus",
                title: "Create",
                to: "/post/edit",
                role: UserRole.MEMBER
            },
            {
                icon: "mdi-file-check",
                title: "Published",
                to: "/posts/published",
                role: UserRole.MEMBER
            },
            {
                icon: "mdi-file",
                title: "Draft",
                to: "/posts/draft",
                role: UserRole.MEMBER
            },
        ],
        auth: true,
        role: UserRole.MEMBER
    },
    {
        icon: "mdi-information",
        title: "About",
        to: "/about",
        auth: false
    },
    {
        icon: "mdi-gavel",
        title: "Legal",
        auth: false,
        children: [{
            icon: "mdi-book-open-page-variant",
            title: "Terms of Service",
            to: "/legal/tos",
            auth: false
        }, {
            icon: "mdi-book-open-page-variant",
            title: "Privacy Policy",
            to: "/legal/privacy_policy",
            auth: false
        }, {
            icon: "mdi-book-open-page-variant",
            title: "Cookie Policy",
            to: "/legal/cookie_policy",
            auth: false
        }]
    }
]

export const QUICK_LINKS = [{
    icon: "mdi-account",
    title: "My Account",
    to: "/profile",
    auth: true,
    role: UserRole.USER
}, {
    icon: "mdi-apps",
    title: "My Dashboard",
    to: "/dashboard",
    auth: true,
    role: UserRole.USER
}, {
    icon: "mdi-account-cog",
    title: "Management",
    to: "/profiles/manage",
    auth: true,
    role: UserRole.ADMIN
}, {
    icon: "mdi-database",
    title: "Statics",
    to: "/statics",
    auth: true,
    role: UserRole.ADMIN
}]