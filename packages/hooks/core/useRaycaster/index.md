---
category: 'core'
---

# RayCaster 射线检测

射线检测。

## Usage

```ts
const {
  /* 射线检测检测到的位置 */
  position,
  /* 更新屏幕位置进行更新检测位置 */
  updatePosition,
  /* 插入物体到射线监测队列 */
  intersect,
} = useRaycaster({ camera, resetPosition })
```

### `camera`

摄像机实例

- 类型：Three.camera

### `resetPosition`

初始位置，默认[0, 0, 0]

- 类型：Three.Vector3
