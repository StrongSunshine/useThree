<script setup lang="ts">
import { PointsMaterial } from 'three'
import { onMounted, ref } from 'vue'
import { useCanvas, useRender } from 'useThree/core'

// function rand(min: number, max?: number) {
//     if (max === undefined) {
//         max = min
//         min = 0
//     }
//     return min + (max - min) * Math.random()
// }

// function randomColor() {
//     return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`
// }

const canvasXY = ref({ x: 0, y: 0 })
const pickPosition = ref({ x: 0, y: 0 })
const color = ref()

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

    console.log(renderer)

    // 点模型渲染几何体每个顶点
    const material = new PointsMaterial({
        size: 1, //点大小
        // vertexColors: VertexColors, //使用顶点颜色渲染
        transparent: true,
        depthWrite: false
    })

    material.onBeforeCompile = arg => {
        console.log(arg)
    }
})
</script>

<template>
    <div>canvasXY: {{ canvasXY }}</div>
    <div>pickPosition: {{ pickPosition }}</div>
    <div>color: {{ color }}</div>
    <div class="div3d"></div>
</template>
