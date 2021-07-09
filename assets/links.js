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