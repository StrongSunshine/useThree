import { PerspectiveCamera } from "three"

/** @description 透视相机  */
interface PerspectiveCameraConfigInterface {
    fov?: number
    aspect?: number
    near?: number
    far?: number
    position?: [number, number, number]
    lookAt?: [number, number, number]
}

export function usePerspectiveCamera(config: PerspectiveCameraConfigInterface) {
    const {
        fov,
        aspect,
        near,
        far,
        position,
        lookAt
    } = {
        fov: 50,
        aspect: 1,
        near: 0.1,
        far: 2000,
        ...config
    }

    const camera = new PerspectiveCamera(fov, aspect, near, far)

    if (position) {
        camera.position.set(...position)
    }

    if (lookAt) {
        camera.lookAt(...lookAt)
    }


    return camera
}
