import { UserConfig } from 'vitepress'
import generateSidebar from './plugins/SideBar'

const config = async (): Promise<UserConfig> => {
    const sidebar = await generateSidebar()

    return {
        lang: 'zh',
        title: 'useThree',
        lastUpdated: true,
        description: 'threeJs playground',

        markdown: {
            theme: {
                light: 'vitesse-light',
                dark: 'vitesse-dark'
            },
        },

        themeConfig: {
            logo: '/useThree.png',
            socialLinks: [
                { icon: 'github', link: 'https://github.com/StrongSunshine' }
            ],

            footer: {
                message: 'Released under the MIT License.',
                copyright: 'Copyright © 2022-PRESENT StrongSunshine',
            },

            sidebar: sidebar
        },

        head: [
            ['meta', { name: 'theme-color', content: '#ffffff' }],
            ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
            ['meta', { name: 'author', content: 'StrongSunshine' }]
        ]
    }
}

export default config
