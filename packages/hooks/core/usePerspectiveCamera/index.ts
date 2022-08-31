import { type Vector3, PerspectiveCamera } from "three"

/** @description 透视相机  */
interface PerspectiveCameraConfigInterface {
    fov?: number
    aspect?: number
    near?: number
    far?: number
    position?: Vector3
    lookAt?: Vector3
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
        camera.position.set(position.x, position.y, position.z)
    }

    if (lookAt) {
        camera.lookAt(lookAt.x, lookAt.y, lookAt.z)
    }


    return camera
}
