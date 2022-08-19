/*
 * @Author: strong sunshine
 * @LastEditors: strong sunshine
 * @LastEditTime: 2022-08-19 17:37:21
 * @Description: 获取type.d.ts定义
 */
import { join, resolve } from 'path'
import fs from 'fs'
import prettier from 'prettier'
import parser from 'prettier/parser-typescript'

const PKG_DIR = resolve(__dirname, '../types/packages/hooks')

export async function getTypeDefinition(pkg: string, name: string): Promise<string | undefined> {
    const typingFilepath = join(PKG_DIR, `${pkg}/${name}/index.d.ts`)

    if (!fs.existsSync(typingFilepath))
        return

    let types = await fs.readFileSync(typingFilepath, 'utf-8')

    if (!types)
        return

    // 去除导入导出
    types = types
        .replace(/import\(.*?\)\./g, '')
        .replace(/import[\s\S]+?from ?["'][\s\S]+?["']/g, '')
        .replace(/export {}/g, '')

    return prettier
        .format(
            types,
            {
                semi: false,
                parser: 'typescript',
                plugins: [parser],
            },
        )
        .trim()
}
