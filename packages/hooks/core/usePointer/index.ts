import { Camera, InstancedMesh, Intersection, Object3D, Vector2, Vector3 } from 'three'
import { useRaycaster } from 'useThree/core'

export interface PointerEventInterface {
    type: 'pointerenter' | 'pointermove' | 'pointerleave' | 'click'
    position?: Vector2
    positionN?: Vector2
    positionV3?: Vector3
}

export interface PointerIntersectEventInterface {
    type: 'pointerenter' | 'pointerover' | 'pointermove' | 'pointerleave' | 'click'
    component: any
    over?: boolean
    intersect?: Intersection
}

export type PointerCallbackType = (e: PointerEventInterface) => void
export type PointerIntersectCallbackType = (e: PointerIntersectEventInterface) => void

export interface PointerPublicConfigInterface {
    /**@description 射线检测模式 */
    intersectMode?: 'frame'
    /**@description 是否递归设置所有子物体 */
    intersectRecursive?: boolean
    /**@description 是否移动设备 */
    touch?: boolean
    /**@description 移除事件是否重置位置 */
    resetOnEnd?: boolean
    onEnter?: PointerCallbackType
    onMove?: PointerCallbackType
    onLeave?: PointerCallbackType
    onClick?: PointerCallbackType
    onIntersectEnter?: PointerIntersectCallbackType
    onIntersectOver?: PointerIntersectCallbackType
    onIntersectMove?: PointerIntersectCallbackType
    onIntersectLeave?: PointerIntersectCallbackType
    onIntersectClick?: PointerIntersectCallbackType
}

export interface PointerConfigInterface extends PointerPublicConfigInterface {
    /**@description 摄像机 */
    camera: Camera
    /**@description canvas元素 */
    domElement: HTMLCanvasElement
    /**@description 射线检测物体合集 */
    intersectObjects: Object3D[] | (() => Object3D[])
}

export interface PointerInterface {
    /**@description 射线检测坐标-屏幕坐标-左上角 */
    position: Vector2
    /**@description 射线检测坐标-屏幕坐标-中心点 */
    positionN: Vector2
    /**@description 射线检测坐标-三维坐标 */
    positionV3: Vector3
    /**@description 射线检测物体合集 */
    intersectObjects: Object3D[] | (() => Object3D[])
    /**@description 是否存在事件监听 */
    listeners: boolean
    /**@description 添加事件监听 */
    addListeners(cb: void): void
    /**@description 移除事件监听 */
    removeListeners(cb: void): void
    /**@description 射线检测 */
    intersect(): void
}

export function usePointer(options: PointerConfigInterface): PointerInterface {
    const noop = () => { }

    const {
        camera,
        domElement,
        intersectObjects,
        intersectRecursive = false,
        touch = true,
        resetOnEnd = false,
        onEnter = noop,
        onMove = noop,
        onLeave = noop,
        onClick = noop,
        onIntersectEnter = noop,
        onIntersectOver = noop,
        onIntersectMove = noop,
        onIntersectLeave = noop,
        onIntersectClick = noop,
    } = options

    const position = new Vector2(0, 0)
    const positionN = new Vector2(0, 0)

    const raycaster = useRaycaster({ camera })
    const positionV3 = raycaster.position

    const obj: PointerInterface = {
        position,
        positionN,
        positionV3,
        intersectObjects,
        listeners: false,
        addListeners,
        removeListeners,
        intersect,
    }

    return obj

    /**
     * @description: 重置监测坐标
     */
    function reset() {
        position.set(0, 0)
        positionN.set(0, 0)
        positionV3.set(0, 0, 0)
    }

    /**
     * @description: 更新监测位置
     */
    function updatePosition(event: TouchEvent | MouseEvent) {
        let x, y
        // @ts-ignore
        if (event.touches && event.touches.length > 0) {
            x = (<TouchEvent>event).touches[0].clientX
            y = (<TouchEvent>event).touches[0].clientY
        } else {
            x = (<MouseEvent>event).clientX
            y = (<MouseEvent>event).clientY
        }

        const rect = domElement.getBoundingClientRect()
        position.x = x - rect.left
        position.y = y - rect.top
        /* 换算中心点坐标系 */
        positionN.x = (position.x / rect.width) * 2 - 1
        positionN.y = -(position.y / rect.height) * 2 + 1
        raycaster.updatePosition(positionN)
    }

    function intersect() {
        const _intersectObjects = getIntersectObjects()
        if (_intersectObjects.length) {
            const intersects = raycaster.intersect(positionN, _intersectObjects, intersectRecursive)
            const offObjects: Object3D[] = [..._intersectObjects]
            const iMeshes: InstancedMesh[] = []

            intersects.forEach(intersect => {
                const { object } = intersect
                const component = getComponent(object)

                // only once for InstancedMesh
                if (object instanceof InstancedMesh) {
                    if (iMeshes.indexOf(object) !== -1) return
                    iMeshes.push(object)
                }

                if (!object.userData.over) {
                    object.userData.over = true
                    const overEvent: PointerIntersectEventInterface = { type: 'pointerover', over: true, component, intersect }
                    const enterEvent: PointerIntersectEventInterface = { ...overEvent, type: 'pointerenter' }
                    onIntersectOver(overEvent)
                    onIntersectEnter(enterEvent)
                    component?.onPointerOver?.(overEvent)
                    component?.onPointerEnter?.(enterEvent)
                }

                const moveEvent: PointerIntersectEventInterface = { type: 'pointermove', component, intersect }
                onIntersectMove(moveEvent)
                component?.onPointerMove?.(moveEvent)

                offObjects.splice(offObjects.indexOf((<Object3D>object)), 1)
            })

            offObjects.forEach(object => {
                const component = getComponent(object)
                if (object.userData.over) {
                    object.userData.over = false
                    const overEvent: PointerIntersectEventInterface = { type: 'pointerover', over: false, component }
                    const leaveEvent: PointerIntersectEventInterface = { ...overEvent, type: 'pointerleave' }
                    onIntersectOver(overEvent)
                    onIntersectLeave(leaveEvent)
                    component?.onPointerOver?.(overEvent)
                    component?.onPointerLeave?.(leaveEvent)
                }
            })
        }
    }

    /**
     * @description: 移入事件
     * @param {TouchEvent} 事件对象
     */
    function pointerEnter(event: TouchEvent | MouseEvent) {
        updatePosition(event)
        onEnter({ type: 'pointerenter', position, positionN, positionV3 })
    }

    /**
     * @description: 移动事件
     * @param {TouchEvent} 事件对象
     */
    function pointerMove(event: TouchEvent | MouseEvent) {
        updatePosition(event)
        onMove({ type: 'pointermove', position, positionN, positionV3 })
        intersect()
    }

    /**
     * @description: 点击事件
     * @param {TouchEvent} 事件对象
     */
    function pointerClick(event: TouchEvent | MouseEvent) {
        updatePosition(event)
        const _intersectObjects = getIntersectObjects()
        if (_intersectObjects.length) {
            const intersects = raycaster.intersect(positionN, _intersectObjects, intersectRecursive)
            const iMeshes: InstancedMesh[] = []
            intersects.forEach(intersect => {
                const { object } = intersect
                const component = getComponent(object)

                // only once for InstancedMesh
                if (object instanceof InstancedMesh) {
                    if (iMeshes.indexOf(object) !== -1) return
                    iMeshes.push(object)
                }

                const event: PointerIntersectEventInterface = { type: 'click', component, intersect }
                onIntersectClick(event)
                component?.onClick?.(event)
            })
        }
        onClick({ type: 'click', position, positionN, positionV3 })
    }

    /**
     * @description: 移出事件
     * @param {TouchEvent} 事件对象
     */
    function pointerLeave() {
        if (resetOnEnd) reset()
        onLeave({ type: 'pointerleave' })
    }

    function getComponent(object: Object3D) {
        if (object.userData.component) return object.userData.component

        let parent = object.parent
        while (parent) {
            if (parent.userData.component) {
                return parent.userData.component
            }
            parent = parent.parent
        }

        return undefined
    }
    /**
     * @description: 返回射线检测队列
     */
    function getIntersectObjects() {
        if (typeof intersectObjects === 'function') {
            return intersectObjects()
        } else return intersectObjects
    }

    function addListeners() {
        domElement.addEventListener('mouseenter', pointerEnter)
        domElement.addEventListener('mousemove', pointerMove)
        domElement.addEventListener('mouseleave', pointerLeave)
        domElement.addEventListener('click', pointerClick)
        if (touch) {
            domElement.addEventListener('touchstart', pointerEnter)
            domElement.addEventListener('touchmove', pointerMove)
            domElement.addEventListener('touchend', pointerLeave)
        }
        obj.listeners = true
    }

    function removeListeners() {
        domElement.removeEventListener('mouseenter', pointerEnter)
        domElement.removeEventListener('mousemove', pointerMove)
        domElement.removeEventListener('mouseleave', pointerLeave)
        domElement.removeEventListener('click', pointerClick)
        if (touch) {
            domElement.removeEventListener('touchstart', pointerEnter)
            domElement.removeEventListener('touchmove', pointerMove)
            domElement.removeEventListener('touchend', pointerLeave)
        }
        obj.listeners = false
    }
}
