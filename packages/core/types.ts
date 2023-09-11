import type { GL } from 'glre/types'

export type Vec3<T = number> = [T, T, T]

export type Mat4<T = number> = [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]

export type ObjectTypes =
        | 'background'
        | 'boxFrame'
        | 'box'
        | 'formula'
        | 'object'
        | 'plane'
        | 'sphere'
        // collection
        | 'U'
        | 'I'
        | 'S'

export type EditorType =
        | 'viewport'
        | 'timeline'
        | 'viewlayer'
        | 'properties'
        | 'I'

export interface EditorState {
        type: EditorType
        id: string
        rate: number[]
        top: boolean
        row: boolean
        active: boolean
        update?: () => void
        children: EditorState[]
        memo: any
}

export interface PLObject {
        type: ObjectTypes
        id: string
        matrix: Mat4
        matrixWorld: Mat4
        position: Vec3
        rotation: Vec3
        scale: Vec3
        color: Vec3
        index: number
        active: boolean
        children: PLObject | PLObject[]
        to: 'U' | 'I' | 'S'

        // shader
        shader: string
        render: string
}

export interface PL extends GL {
        update(): void
        collection: PLObject | null
}
