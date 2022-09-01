import { Scene, Color, Texture } from "three";

type ColorProp = string | number | Texture

export function setBackground(scene: Scene, background?: ColorProp): void {
    if (typeof background === 'string' || typeof background === 'number') {
        if (scene.background instanceof Color) scene.background.set(background)
        else scene.background = new Color(background)
    } else if (background instanceof Texture) {
        scene.background = background
    }
}
