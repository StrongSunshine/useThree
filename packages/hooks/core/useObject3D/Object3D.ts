import type{ Object3D, Renderer, Scene } from "three";

interface BaseObjectPropsInterface {

}

export class BaseObject {
    renderer: Renderer
    scene: Scene
    constructor(renderer: Renderer, scene: Scene, config: BaseObjectPropsInterface) {
        this.renderer = renderer
        this.scene = scene
    }

    init(o3d: Object3D) {

    }
}
