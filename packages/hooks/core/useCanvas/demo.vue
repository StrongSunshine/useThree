<script setup lang="ts">
import { onMounted } from 'vue'
import { useCanvas } from 'useThree/core'

onMounted(() => {
    const div3d = document.querySelector('.div3d')
    const { width, height } = div3d!.getBoundingClientRect()

    const canvas = useCanvas(width, height)
    div3d?.appendChild(canvas)

    const ctx = canvas.getContext('2d')!

    const getX = (x: number) => 15 * (12 * Math.sin(x) - 4 * Math.sin(3 * x))
    const getY = (y: number) =>
        -15 *
        (13 * Math.cos(y) -
            5 * Math.cos(2 * y) -
            2 * Math.cos(3 * y) -
            Math.cos(4 * y))

    // 设置初始弧度
    let radian = 0,
        X = 0,
        Y = 0

    // 设置弧度增量，每次增加1°
    const radian_add = Math.PI / 180

    ctx.beginPath() // 重新映射画布上的 (0,0) 位置

    ctx.translate(width / 2, height / 2) // 设置绘制起点

    ctx.moveTo(getX(radian), getY(radian)) // 弧度小于等于360°

    while (radian <= Math.PI * 2) {
        //每增加一次弧度，绘制一条线
        radian += radian_add

        X = getX(radian)
        Y = getY(radian)

        ctx.lineTo(X, Y)
    }

    ctx.fillStyle = 'red'
    ctx.fill()
})
</script>

<template>
    <div class="div3d"></div>
</template>
