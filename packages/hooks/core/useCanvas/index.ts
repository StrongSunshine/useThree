export default function useCanvas(width: number = 400, height: number = 400) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    return canvas
}
