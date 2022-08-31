import { Scene, Color, Texture } from "three";

type ColorProp = string | number | Texture

export function useScene(background?: ColorProp): [Scene, (value: ColorProp) => void] {
    const scene = new Scene()

    const setBackground = (value: ColorProp) => {
        if (typeof value === 'string' || typeof value === 'number') {
            if (scene.background instanceof Color) scene.background.set(value)
            else scene.background = new Color(value)
        } else if (value instanceof Texture) {
            scene.background = value
        }
    }

    background && setBackground(background)

    return [scene, setBackground]
}
