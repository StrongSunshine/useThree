import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import json from '@rollup/plugin-json'
import type { OutputOptions, RollupOptions } from 'rollup'
import fg from 'fast-glob'
import { resolve } from 'path'

const configs: RollupOptions[] = []

const external = [
    'three',
    'useThree/core',
    'three/examples/jsm/controls/OrbitControls.js'
]

const categoriesNmaes = fg.sync('*', {
    onlyDirectories: true,
    cwd: resolve('packages/hooks/'),
})

for (const category of categoriesNmaes) {
    /* 入口 */
    const input = `packages/hooks/${category}/index.ts`
    const outputPath = `dist/${category}`

    /* 出口 */
    const output: OutputOptions[] = []
    output.push({
        file: `${outputPath}/index.mjs`,
        format: 'es',
    })
    output.push({
        file: `${outputPath}/index.cjs`,
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

    /* 输出ts类型 */
    configs.push({
        input,
        output: {
            file: `${outputPath}/index.d.ts`,
            format: 'es',
        },
        plugins: [
            dts()
        ],
        external,
    })
}

export default configs
