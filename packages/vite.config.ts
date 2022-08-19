import { defineConfig } from 'vite'
import { resolve } from 'path'
import { MarkdownTransform } from './.vitepress/plugins/MarkdownTransform'

export default defineConfig({
    plugins: [
        MarkdownTransform()
    ],
    resolve: {
        alias: {
            useThree: resolve(__dirname, 'hooks')
        }
    }
})
