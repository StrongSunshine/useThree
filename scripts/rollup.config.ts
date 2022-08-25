import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import type { OutputOptions, RollupOptions } from 'rollup'
import fg from 'fast-glob'
import { resolve } from 'path'

const configs: RollupOptions[] = []

const external = [
    'three',
    'useThree/core'
]

const categoriesNmaes = fg.sync('*', {
    onlyDirectories: true,
    cwd: resolve('packages/hooks/'),
})

for (const category of categoriesNmaes) {
    const fnNames = ['index']
    fnNames.push(...fg.sync('*/index.ts', { cwd: resolve(`packages/hooks/${category}`) }).map(i => i.split('/')[0]))

    for (const fn of fnNames) {
        /* 入口 */
        const input = fn === 'index'
            ? `packages/hooks/${category}/index.ts`
            : `packages/hooks/${category}/${fn}/index.ts`

        /* 出口 */
        const output: OutputOptions[] = []
        output.push({
            file: `dist/${category}/${fn}.mjs`,
            format: 'es',
        })
        output.push({
            file: `dist/${category}/${fn}.cjs`,
            format: 'cjs',
        })

        /* 配置填充 */
        configs.push({
            input,
            output,
            plugins: [
                esbuild(),
                json(),
            ],
            external,
        })

        /* 输出ts */
        configs.push({
            input,
            output: {
                file: `dist/${category}/${fn}.d.ts`,
                format: 'es',
            },
            plugins: [
                dts()
            ],
            external,
        })
    }
}

export default configs
