---
category: 'core'
---

# THREE Scene

创建scene

## Usage

```ts
import { useScene } from 'useThree/core'

const [scene, setBackground] = useScene('#263238')

setBackground('#9900ff')
```

### `bgColor`

背景色

- 类型：Nubmer | String | Three.Texture
