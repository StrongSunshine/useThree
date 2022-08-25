import { Camera, Intersection, Object3D, Plane, Raycaster, Vector2, Vector3 } from 'three'

export interface RaycasterInterface {
    position: Vector3
    updatePosition(coords: Vector2): void
    intersect(coords: Vector2, objects: Object3D[], recursive?: boolean): Intersection[],
}

export interface RaycasterConfigInterface {
    camera: Camera
    resetPosition?: Vector3
}

export function useRaycaster(options: RaycasterConfigInterface): RaycasterInterface {
    const {
        camera,
        resetPosition = new Vector3(0, 0, 0),
    } = options

    const raycaster = new Raycaster()
    const position = resetPosition.clone()
    const plane = new Plane(new Vector3(0, 0, 1), 0)

    const updatePosition = (coords: Vector2) => {
        /* coords：X分量与Y分量应当在-1到1之间 */
        raycaster.setFromCamera(coords, camera)
        /* 返回一个能够表示当前摄像机所正视的世界空间方向的Vector3对象。 */
        camera.getWorldDirection(plane.normal)
        /* 将Ray（射线）与一个Box3相交，并返回交点 */
        raycaster.ray.intersectPlane(plane, position)
    }

    /**
     *  检测所有在射线与这些物体之间，包括或不包括后代的相交部分。
     *  recursive：是否递归设置所有子物体
    */
    const intersect = (coords: Vector2, objects: Object3D[], recursive = false) => {
        raycaster.setFromCamera(coords, camera)
        return raycaster.intersectObjects(objects, recursive)
    }

    return {
        position,
        updatePosition,
        intersect,
    }
}
