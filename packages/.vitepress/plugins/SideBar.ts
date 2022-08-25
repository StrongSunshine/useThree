import fg from 'fast-glob'
import { resolve } from 'path'
import { DefaultTheme } from 'vitepress'

const DIR_HOOKS = resolve(__dirname, '../../hooks')

const listCategories = async (dir: string, ignore: string[] = []) => {
    const dirs = await fg('*', {
        onlyDirectories: true,
        cwd: dir,
        ignore: [
            '_*',
            ...ignore,
        ],
    })
    return dirs
}

const generateSideBar = async () => {
    const sidebar: DefaultTheme.Config['sidebar'] = []

    const categoryNames = await listCategories(DIR_HOOKS)

    await Promise.all(categoryNames.map(async name => {
        const files = await fg('*', {
            onlyDirectories: true,
            cwd: resolve(DIR_HOOKS, name),
            ignore: [
                '_*',
            ],
        })

        sidebar.push({
            text: name,
            items: files.map(i => ({
                text: i,
                link: `/hooks/${name}/${i}/`,
            })),
        })
    }))

    return sidebar
}

export default generateSideBar
