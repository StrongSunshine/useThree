import type { Plugin } from 'vite'
import fs from 'fs'
import { join } from 'path'
import { getTypeDefinition } from '../../../scripts'

export function MarkdownTransform(): Plugin {
    return {
        name: 'md-transform',
        enforce: 'pre',
        async transform(code, id) {
            /* 仅匹配md文档, \b匹配单词 */
            if (!id.match(/\.md\b/)) return null

            /* 获取md文档信息 */
            const [pkg, name, i] = id.split('/').slice(-3)

            console.log('md info --->', pkg, name, i);

            if (i === 'index.md') {
                const frontmatterEnds = code.indexOf('---\n\n') + 4
                const firstSubheader = code.search(/\n## \w/)

                const sliceIndex = firstSubheader < 0 ? frontmatterEnds : firstSubheader

                const { footer, header } = await getFunctionMarkdown(pkg, name)

                // if (hasTypes)
                //     code = replacer(code, footer, 'FOOTER', 'tail')
                if (header)
                    code = code.slice(0, sliceIndex) + '\n\n' + header + '\n\n' + code.slice(sliceIndex)

            }

            return code
        }
    }
}

const PKG_DIR = '../../hooks/'

async function getFunctionMarkdown(pkg: string, name: string) {
    /* 判断是否存在demo.vue */
    const hasDemo = fs.existsSync(join(__dirname, PKG_DIR, pkg, name, 'demo.vue'))
    /* 获取d.ts类型定义 */
    const types = await getTypeDefinition(pkg, name)

    let typingSection = ''

    if (types) {
        const code = `\`\`\`typescript\n${types.trim()}\n\`\`\``
        typingSection = types.length > 1000
            ? [
                '## Type Declarations',
                '<summary op50 italic>Show Type Declarations</summary>',
                '<details>',
                code,
                '</details>'
            ].join('\n') : `\n## Type Declarations\n\n${code}`
    }

    const demoSection = hasDemo
        ? [
            '<script setup>',
            'import Demo from \'./demo.vue\'',
            '</script>',
            '## Demo',
            '<DemoContainer>',
            '<Demo/>',
            '</DemoContainer>'
        ].join('\n\n') : ''

    return {
        header: demoSection,
        footer: typingSection
    }
}
