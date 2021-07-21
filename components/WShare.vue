<template>
    <v-dialog v-model="dialog" max-width="640">
        <template v-slot:activator="{ on, attrs }">
            <v-btn @click.prevent="() => {}" v-on="on" v-bind="attrs" icon>
                <v-icon>mdi-share</v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                Share
                <v-spacer></v-spacer>
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-subtitle>{{ title }}</v-card-subtitle>
            <v-card-text>
                Share this post on social media.
                <v-text-field outlined label="Search" placeholder="Find a social media" dense v-model="query"></v-text-field>
                <div class="share-network-list">
                    <ShareNetwork
                        v-for="network in filter(networks)"
                        :network="network.network"
                        :key="network.network"
                        :style="{backgroundColor: network.color}"
                        :url="`https://wirefact.com/post/${id}`"
                        :title="title"
                        :description="excerpt"
                        :quote="excerpt"
                        :hashtags="hashtags.join(',')"
                    >
                        <v-icon v-if="network.icon" class="pl-1" small dark>{{ network.icon }}</v-icon>
                        <span>{{ network.name }}</span>
                    </ShareNetwork>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ["id","title","excerpt","hashtags"],
    data: () => ({
        dialog: false,
        query: null,
        networks: [
            { network: 'buffer', name: 'Buffer', icon: 'mdi-buffer', color: '#323b43' },
            { network: 'email', name: 'Email', icon: 'mdi-email', color: '#333333' },
            { network: 'evernote', name: 'Evernote', icon: 'mdi-evernote', color: '#2dbe60' },
            { network: 'facebook', name: 'Facebook', icon: 'mdi-facebook', color: '#1877f2' },
            { network: 'instapaper', name: 'Instapaper', icon: 'mdi-format-italic', color: '#428bca' },
            { network: 'line', name: 'Line', color: '#00c300' },
            { network: 'linkedin', name: 'LinkedIn', icon: 'mdi-linkedin', color: '#007bb5' },
            { network: 'messenger', name: 'Messenger', icon: 'mdi-facebook-messenger', color: '#0084ff' },
            { network: 'odnoklassniki', name: 'Odnoklassniki', icon: 'mdi-odnoklassniki', color: '#ed812b' },
            { network: 'pinterest', name: 'Pinterest', icon: 'mdi-pinterest', color: '#bd081c' },
            { network: 'quora', name: 'Quora', icon: 'mdi-quora', color: '#a82400' },
            { network: 'reddit', name: 'Reddit', icon: 'mdi-reddit', color: '#ff4500' },
            { network: 'skype', name: 'Skype', icon: 'mdi-skype', color: '#00aff0' },
            { network: 'sms', name: 'SMS', icon: 'mdi-android-messages', color: '#333333' },
            { network: 'telegram', name: 'Telegram', icon: 'mdi-send', color: '#0088cc' },
            { network: 'tumblr', name: 'Tumblr', color: '#35465c' },
            { network: 'twitter', name: 'Twitter', icon: 'mdi-twitter', color: '#1da1f2' },
            { network: 'viber', name: 'Viber', color: '#59267c' },
            { network: 'vk', name: 'Vk', icon: 'mdi-vk', color: '#4a76a8' },
            { network: 'weibo', name: 'Weibo', icon: 'mdi-sina-weibo', color: '#e9152d' },
            { network: 'whatsapp', name: 'Whatsapp', icon: 'mdi-whatsapp', color: '#25d366' },
            { network: 'wordpress', name: 'Wordpress', icon: 'mdi-wordpress', color: '#21759b' },
            { network: 'xing', name: 'Xing', icon: 'mdi-xing', color: '#026466' },
            { network: 'yammer', name: 'Yammer', icon: 'mdi-microsoft-yammer', color: '#0072c6' }
      ]
    }),
    methods: {
        filter(networks) {
            if (!this.query || !this.query.trim().length) return networks
            return networks.filter(network => network.network.search(new RegExp(this.query, "i")) !== -1)
        }
    }
}
</script>

<style>
.share-network-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 1000px;
    margin: auto;
}
a[class^="share-network-"] {
    flex: none;
    color: #FFFFFF;
    background-color: #333;
    border-radius: 3px;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
    cursor: pointer;
    margin: 0 10px 10px 0;
    text-decoration: none;
}
a[class^="share-network-"] span {
    padding: 0 10px;
    flex: 1 1 0%;
    font-weight: 500;
}
</style>
