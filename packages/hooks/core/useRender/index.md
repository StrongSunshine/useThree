---
category: 'core'
---

# THREE Render

创建webglRender

## Usage

::: tip
如果你需要一个透明的渲染器，你应该在渲染器上使用 alpha。
:::

```ts
import { onMounted } from 'vue'
import { useRender } from 'useThree/core'

onMounted(() => {
    const dom = document.querySelector('.div3d')

    const { width, height } = dom!.getBoundingClientRect()

    const helper = useRender({
        antialias: true,
        alpha: true,
        autoClear: true,
        orbitCtrl: true,
        pointer: true,
        resize: true,
        width,
        height
    })

    console.log(helper.renderer);
})
```
