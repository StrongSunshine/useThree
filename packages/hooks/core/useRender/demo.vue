<script setup lang="ts">
import { onMounted } from 'vue'
import {
    useRender,
    useCanvas,
    usePerspectiveCamera
} from 'useThree/core'
import { Scene, Mesh, MeshPhongMaterial, DirectionalLight, TorusGeometry } from 'three'

onMounted(() => {
    const div3d = document.querySelector('.div3d')
    const { width, height } = div3d!.getBoundingClientRect()

    const canvas = useCanvas(width, height)
    div3d?.appendChild(canvas)

    const renderer = useRender({
        alpha: true,
        canvas,
        width,
        height
    })

    const scene = new Scene()
    const camera = usePerspectiveCamera({
        fov: 75,
        aspect: width / height,
        position: [0, 7.5, 15],
        lookAt: [0, 0, 0]
    })

    const dirLight = new DirectionalLight(0xffffff, 1)
    dirLight.position.set(-30, 30, 30).normalize()
    scene.add(dirLight)

    const material = new MeshPhongMaterial({ color: 0x00ff99 })
    const geometry = new TorusGeometry(5, 2, 24, 32)
    const mesh = new Mesh(geometry, material)
    mesh.position.set(0, 0, 0)
    scene.add(mesh)

    renderer.scene = scene
    renderer.camera = camera

    renderer.init()
    renderer.render()
})
</script>

<template>
    <div class="div3d"></div>
</template>
