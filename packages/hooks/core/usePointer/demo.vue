<script setup lang="ts">
import {
    WebGLRenderer,
    Scene,
    DirectionalLight,
    Vector2,
    Vector3,
    BoxGeometry,
    MeshPhongMaterial,
    DoubleSide,
    Mesh,
    Color
} from 'three'
import { onMounted, reactive } from 'vue'
import {
    useCanvas,
    usePerspectiveCamera,
    usePointer,
    PointerEventInterface,
    PointerIntersectEventInterface
} from 'useThree/core'

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

const pos = reactive({
    color: new Color(),
    position: new Vector2(),
    positionN: new Vector2(),
    positionV3: new Vector3()
})

onMounted(() => {
    const div3d = document.querySelector('.div3d')
    const { width, height } = div3d!.getBoundingClientRect()

    const canvas = useCanvas(width, height)
    div3d?.appendChild(canvas)

    const renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas
    })

    const scene = new Scene()

    const camera = usePerspectiveCamera({
        aspect: width / height,
        position: [50, 50, 50],
        lookAt: [0, 0, 0]
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

    const handleCubeClick = (arg: PointerIntersectEventInterface) => {
        if (arg.intersect) pos.color.copy((arg.intersect.object as any).material.color)
    }

    const handleClick = (arg: PointerEventInterface) => {
        arg.position && pos.position?.copy(arg.position)
        arg.positionN && pos.positionN?.copy(arg.positionN)
        arg.positionV3 && pos.positionV3?.copy(arg.positionV3)
    }

    const pointer = usePointer({
        camera,
        onClick: handleClick,
        onIntersectClick: handleCubeClick,
        domElement: canvas,
        intersectObjects: scene.children
    })

    pointer.addListeners()

    renderer.render(scene, camera)
})
</script>

<template>
    <div>intersect: {{ pos.color.getStyle() }}</div>
    <div>position: {{ pos.position }}</div>
    <div>positionN: {{ pos.positionN }}</div>
    <div>
        <div>positionV3:</div>
        <div>x: {{ pos.positionV3.x }}</div>
        <div>y: {{ pos.positionV3.y }}</div>
        <div>z: {{ pos.positionV3.z }}</div>
    </div>
    <div class="div3d"></div>
</template>
