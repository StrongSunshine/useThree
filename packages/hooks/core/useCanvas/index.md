---
category: 'core'
---

# create Canvas

创建一个canvas元素

## Usage

```ts
import { onMounted } from 'vue'
import { useCanvas } from 'useThree/core'

onMounted(() => {
    const dom = document.querySelector('.div3d')

    const { width, height } = dom!.getBoundingClientRect()

    const canvas = useCanvas(width, height)

    dom.appendChild(canvas)
})
```

### `width`

宽

- 类型：number

### `height`

高

- 类型：number
