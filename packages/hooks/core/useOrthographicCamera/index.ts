import { OrthographicCamera } from "three"

/** @description 正交相机  */
interface OrthographicCameraConfigInterface {
    left?: number
    right?: number
    top?: number
    bottom?: number
    near?: number
    far?: number
    position?: [number, number, number]
}

export function useOrthographicCamera(config: OrthographicCameraConfigInterface) {
    const {
        left,
        right,
        top,
        bottom,
        near,
        far,
        position
    } = {
        left: -1,
        right: 1,
        top: 1,
        bottom: -1,
        near: 0.1,
        far: 2000,
        ...config
    }

    const camera = new OrthographicCamera(left, right, top, bottom, near, far)

    if (position) {
        camera.position.set(...position)
    }

    return camera
}
