<script setup lang="ts">
import { onMounted } from 'vue'
import { useRender, useCanvas } from 'useThree/core'
import {
    Mesh,
    Scene,
    PerspectiveCamera,
    MeshPhongMaterial,
    DirectionalLight,
    TorusGeometry
} from 'three'

onMounted(() => {
    const div3d = document.querySelector('.div3d')
    const { width, height } = div3d!.getBoundingClientRect()

    const canvas = useCanvas(width, height)
    div3d?.appendChild(canvas)

    const threeHelper = useRender({
        alpha: true,
        canvas,
        width,
        height
    })

    const scene = new Scene()
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(10, 10, 10)
    camera.lookAt(0, 0, 0)

    const dirLight = new DirectionalLight(0xffffff, 1)
    dirLight.position.set(-3, 3, 3).normalize()
    scene.add(dirLight)

    const material = new MeshPhongMaterial({ color: 0x00ff99 })
    const geometry = new TorusGeometry(5, 2, 24, 32)
    const mesh = new Mesh(geometry, material)
    mesh.position.set(0, 0, 0)
    scene.add(mesh)

    threeHelper.scene = scene
    threeHelper.camera = camera

    threeHelper.init()
    threeHelper.render()
})
</script>

<template>
    <div class="div3d"></div>
</template>
