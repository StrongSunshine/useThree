<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCanvas, useRaycaster } from 'useThree/core'
import {
    Mesh,
    Scene,
    PerspectiveCamera,
    MeshPhongMaterial,
    DirectionalLight,
    BoxGeometry,
    DoubleSide,
    WebGLRenderer,
    Vector2,
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function rand(min: number, max?: number) {
    if (max === undefined) {
        max = min
        min = 0
    }
    return min + (max - min) * Math.random()
}

function randomColor() {
    return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`
}

const canvasXY = ref({ x: 0, y: 0 })
const pickPosition = ref({ x: 0, y: 0 })
const color = ref()

onMounted(() => {
    const div3d = document.querySelector('.div3d')
    const { width, height } = div3d!.getBoundingClientRect()

    const canvas = useCanvas(width, height)
    div3d!.appendChild(canvas)

    const scene = new Scene()
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(30, 30, 30)
    camera.lookAt(0, 0, 0)

    const render = new WebGLRenderer({
        alpha: true,
        canvas
    })

    /* 光源 */
    const dirLight = new DirectionalLight(0xffffff, 1)
    dirLight.position.set(-30, 30, 30).normalize()
    const dirLight1 = new DirectionalLight(0xffffff, 1)
    dirLight1.position.set(30, -30, -30).normalize()
    scene.add(dirLight)
    scene.add(dirLight1)

    /* 立方体 */
    const geometry = new BoxGeometry(1, 1, 1)

    /* 随机100个物体 */
    for (let index = 0; index < 200; index++) {
        const material = new MeshPhongMaterial({
            color: randomColor(),
            side: DoubleSide
        })

        const cube = new Mesh(geometry, material)
        cube.position.set(rand(-30, 30), rand(-30, 30), rand(-30, 30))
        cube.rotation.set(rand(Math.PI), rand(Math.PI), 0)

        scene.add(cube)
    }

    /* 控制器 */
    const cameraCtrl = new OrbitControls(camera, render.domElement)

    cameraCtrl.update()
    render.render(scene, camera)

    cameraCtrl.addEventListener('change', () => {
        render.render(scene, camera)
    })

    /* 射线检测 */
    const { intersect } = useRaycaster({ camera })

    /* 获取鼠标坐标 */
    const getCanvasRelativePosition = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        return {
            x: ((event.clientX - rect.left) * canvas.width) / rect.width,
            y: ((event.clientY - rect.top) * canvas.height) / rect.height
        }
    }

    /* 设置拾取坐标 */
    const setPickPosition = (event: MouseEvent) => {
        const v2Pos = (canvasXY.value = getCanvasRelativePosition(event))
        // canvas坐标系转中心坐标系
        pickPosition.value.x = (v2Pos.x / canvas.width) * 2 - 1
        pickPosition.value.y = (v2Pos.y / canvas.height) * -2 + 1
        // updatePosition
        const coords = new Vector2(pickPosition.value.x, pickPosition.value.y)
        // 获取物体
        const obj = intersect(coords, scene.children)
        if(obj.length) {
            const plan = obj[0].object
            color.value = (plan as any).material.color.getStyle()
        }
    }

    /* 清除坐标 */
    const clearPickPosition = () => {
        pickPosition.value.x = -100
        pickPosition.value.y = -100
    }

    /* 坐标拾取 */
    window.addEventListener('mousemove', setPickPosition)
    window.addEventListener('mouseout', clearPickPosition)
    window.addEventListener('mouseleave', clearPickPosition)
})
</script>

<template>
    <div>canvasXY: {{ canvasXY }}</div>
    <div>pickPosition: {{ pickPosition }}</div>
    <div>color: {{ color }}</div>
    <div class="div3d"></div>
</template>
