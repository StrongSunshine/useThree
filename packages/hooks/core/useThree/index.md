---
category: 'core'
---

# THREE helper

创建webglRender

## Usage

```ts
import { onMounted } from 'vue'
import useThree from 'useThree/core/useThree'

onMounted(() => {
    const dom = document.querySelector('.div3d')

    const { width, height } = dom!.getBoundingClientRect()

    const helper = useThree({
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
