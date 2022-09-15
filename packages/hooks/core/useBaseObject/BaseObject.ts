import { Object3D, Scene, Vector3, Euler, Group } from "three";

type ParentType = Object3D | Scene | Group

export interface Object3DInterface {
    addToParent(o?: Object3D): boolean
    removeFromParent(o?: Object3D): boolean
    add(o: Object3D): void
    remove(o: Object3D): void
}

export interface BaseObjectPropsInterface {
    position?: Vector3
    rotation?: Euler
    scale?: Vector3
    lookAt?: Vector3
    userData?: Object
    visible?: Boolean
    disableAdd?: Boolean
    parent?:ParentType
}

export class BaseObject {
    o3d: Object3D
    parent: ParentType | null
    config: BaseObjectPropsInterface
    constructor(config: BaseObjectPropsInterface) {
        this.config = config

        /* init */
        this.o3d = new Object3D()
        this.parent = config.parent ?? null
        this.init()
    }

    init() {
        const {
            position,
            rotation,
            scale,
            visible,
            userData = {},
            lookAt,
            disableAdd
        } = this.config

        position && this.o3d.position.copy(position)
        rotation && this.o3d.rotation.copy(rotation)
        scale && this.o3d.scale.copy(scale)
        lookAt && this.o3d.lookAt(lookAt)

        this.o3d.visible = !!visible
        this.o3d.userData = userData

        if (!disableAdd) this.addToParent()
    }

    addToParent(o?: ParentType) {
        if (o) {
            this.removeFromParent()
            o.add(this.o3d)
            this.parent = o
        } else {
            this.parent?.add(this.o3d)
        }
    }

    removeFromParent() {
        if (this.parent) {
            this.parent.remove(this.o3d)
            this.parent = null
            return true
        }
        return false
    }

    add(o: Object3D) { this.o3d.add(o) }

    remove(o: Object3D) { this.o3d.remove(o) }
}
