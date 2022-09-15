import { BaseObject, type BaseObjectPropsInterface } from "./BaseObject"

export function useBaseObject(config: BaseObjectPropsInterface) {
    return new BaseObject(config)
}
