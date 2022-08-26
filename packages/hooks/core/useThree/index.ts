import { Camera, Object3D, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer, WebGLRendererParameters } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import type { OrbitControls as OrbitControlsType } from 'three/examples/jsm/controls/OrbitControls.js'
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'

import { usePointer } from 'useThree/core'

import type {
    PointerConfigInterface,
    PointerPublicConfigInterface,
    PointerInterface
} from 'useThree/core'

export interface SizeInterface {
    /** @description 宽度 */
    width: number
    /** @description 高度 */
    height: number
    /** @description 视野宽度 */
    wWidth: number
    /** @description 视野高度 */
    wHeight: number
    /** @description 纵横比 */
    ratio: number
}

export interface ThreeConfigInterface {
    /** @description WebGLRendererParameters */
    params?: WebGLRendererParameters
    /** @description 渲染器绘制输出的画布。 */
    canvas?: HTMLCanvasElement
    /** @description 是否执行抗锯齿。默认值为true */
    antialias?: boolean
    /** @description 画布是否包含alpha（透明度）缓冲区。默认值为false */
    alpha?: boolean
    /** @description 是否在渲染每一帧之前自动清除其输出。默认值为true */
    autoClear?: boolean
    /** @description 是否开启鼠标控制。默认值为false */
    orbitCtrl?: boolean | Record<string, unknown>
    /** @description 鼠标操作辅助器。默认值为false */
    pointer?: boolean | PointerPublicConfigInterface
    /** @description 大小自适应。默认值为false， 值为window时设置浏览器窗口大小 */
    resize?: boolean | string
    /** @description 画布宽度。默认值为300 */
    width?: number
    /** @description 画布高度。默认值为150 */
    height?: number
    /** @description resize回调函数 */
    onResize?(size: SizeInterface): void
}

export interface ThreeInterface {
    /** @description 返回传入参数 */
    config: ThreeConfigInterface
    /** @description 渲染器 */
    renderer: WebGLRenderer
    /** @description 效果合成器 */
    composer?: EffectComposer
    /** @description 相机 */
    camera?: Camera
    /** @description 轨道控制器 */
    cameraCtrl?: OrbitControlsType
    /** @description 场景 */
    scene?: Scene
    /** @description 鼠标辅助器 */
    pointer?: PointerInterface
    /** @description 渲染大小 */
    size: SizeInterface
    /** @description 初始化renderer */
    init(): boolean
    /** @description 销毁 */
    dispose(): void
    /** @description 渲染scene */
    render(): void
    /** @description 渲染效果 */
    renderC(): void
    /** @description 设置渲染场景大小 */
    setSize(width: number, height: number): void
    /** @description 添加射线检测物体 */
    addIntersectObject(o: Object3D): void
    /** @description 移除射线检测物体 */
    removeIntersectObject(o: Object3D): void
}

/**
 * Three.js helper
 */
export function useThree(params: ThreeConfigInterface): ThreeInterface {
    /* 默认参数 */
    let config: ThreeConfigInterface = {
        antialias: true,
        alpha: false,
        autoClear: true,
        orbitCtrl: false,
        pointer: false,
        resize: false,
        width: 300,
        height: 150,
    }

    /* 合并参数 */
    config = {
        ...config,
        ...params
    }

    /* size */
    const size: SizeInterface = {
        width: 1, height: 1,
        wWidth: 1, wHeight: 1,
        ratio: 1,
    }

    /* 初始化之前的回调 */
    const beforeRenderCallbacks: { (): void }[] = []

    /* 射线监测物体集合 */
    const intersectObjects: Object3D[] = []

    /* THREEJS renderer */
    const renderer = createRenderer()

    const obj: ThreeInterface = {
        config,
        renderer,
        size,
        init,
        dispose,
        render,
        renderC,
        setSize,
        addIntersectObject,
        removeIntersectObject,
    }

    return obj

    /**
     * create WebGLRenderer
     */
    function createRenderer(): WebGLRenderer {
        const { canvas, antialias, alpha, autoClear } = config
        const renderer = new WebGLRenderer({
            canvas,
            antialias,
            alpha,
            ...config.params
        })
        renderer.autoClear = !!autoClear
        return renderer
    }

    /**
     * init helper
     */
    function init() {
        if (!obj.scene) {
            console.error('Missing Scene')
            return false
        }

        if (!obj.camera) {
            console.error('Missing Camera')
            return false
        }

        if (config.resize) {
            onResize()
            window.addEventListener('resize', onResize)
        } else if (config.width && config.height) {
            setSize(config.width, config.height)
        }

        initPointer()

        if (config.orbitCtrl) {
            const cameraCtrl = new OrbitControls(obj.camera, obj.renderer.domElement)
            if (config.orbitCtrl instanceof Object) {
                Object.entries(config.orbitCtrl).forEach(([key, value]) => {
                    // @ts-ignore
                    cameraCtrl[key] = value
                })
            }
            onBeforeRender(() => { cameraCtrl.update() })
            obj.cameraCtrl = cameraCtrl
        }

        return true
    }

    /**
     * init pointer
     */
    function initPointer() {
        let pointerConf: PointerConfigInterface = {
            camera: obj.camera!,
            domElement: obj.renderer!.domElement,
            intersectObjects,
        }

        if (config.pointer && config.pointer instanceof Object) {
            pointerConf = { ...pointerConf, ...config.pointer }
        }

        const pointer = obj.pointer = usePointer(pointerConf)
        if (config.pointer || intersectObjects.length) {
            pointer.addListeners()
            if (pointerConf.intersectMode === 'frame') {
                onBeforeRender(pointer.intersect)
            }
        }
    }

    /**
     * add before render callback
     */
    function onBeforeRender(cb: { (): void }) {
        beforeRenderCallbacks.push(cb)
    }

    /**
     * default render
     */
    function render() {
        // if (obj.cameraCtrl) obj.cameraCtrl.update()
        beforeRenderCallbacks.forEach(c => c())
        obj.renderer!.render(obj.scene!, obj.camera!)
    }

    /**
     * composer render
     */
    function renderC() {
        // if (obj.cameraCtrl) obj.cameraCtrl.update()
        beforeRenderCallbacks.forEach(c => c())
        obj.composer!.render()
    }

    /**
     * add intersect object
     */
    function addIntersectObject(o: Object3D) {
        if (intersectObjects.indexOf(o) === -1) {
            intersectObjects.push(o)
        }
        // add listeners if needed
        if (obj.pointer && !obj.pointer.listeners) {
            obj.pointer.addListeners()
        }
    }

    /**
     * remove intersect object
     */
    function removeIntersectObject(o: Object3D) {
        const i = intersectObjects.indexOf(o)
        if (i !== -1) {
            intersectObjects.splice(i, 1)
        }
        // remove listeners if needed
        if (obj.pointer && !config.pointer && intersectObjects.length === 0) {
            obj.pointer.removeListeners()
        }
    }

    /**
     * remove listeners and dispose
     */
    function dispose() {
        // beforeRenderCallbacks = []
        window.removeEventListener('resize', onResize)
        if (obj.pointer) obj.pointer.removeListeners()
        if (obj.cameraCtrl) obj.cameraCtrl.dispose()
        if (obj.renderer) obj.renderer.dispose()
    }

    /**
     * resize listener
     */
    function onResize() {
        if (config.resize === 'window') {
            setSize(window.innerWidth, window.innerHeight)
        } else {
            const elt = obj.renderer!.domElement.parentNode as Element
            if (elt) setSize(elt.clientWidth, elt.clientHeight)
        }
        config.onResize?.(size)
    }

    /**
     * update renderer size and camera
     */
    function setSize(width: number, height: number) {
        size.width = width
        size.height = height
        size.ratio = width / height

        obj.renderer!.setSize(width, height, false)

        // already done in EffectComposer
        // if (obj.composer) {
        //   obj.composer.setSize(width, height)
        // }

        const camera = (<Camera>obj.camera!)
        if (camera.type === 'PerspectiveCamera') {
            const pCamera = (<PerspectiveCamera>camera)
            pCamera.aspect = size.ratio
            pCamera.updateProjectionMatrix()
        }

        if (camera.type === 'OrthographicCamera') {
            const oCamera = (<OrthographicCamera>camera)
            size.wWidth = oCamera.right - oCamera.left
            size.wHeight = oCamera.top - oCamera.bottom
        } else {
            const wsize = getCameraSize()
            size.wWidth = wsize[0]
            size.wHeight = wsize[1]
        }
    }

    /**
     * calculate camera visible area size
     */
    function getCameraSize() {
        const camera = (<PerspectiveCamera>obj.camera!)
        const vFOV = (camera.fov * Math.PI) / 180
        const h = 2 * Math.tan(vFOV / 2) * Math.abs(camera.position.z)
        const w = h * camera.aspect
        return [w, h]
    }
}
