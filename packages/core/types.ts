import type { GL } from 'glre/types'

export type Vec3<T = number> = [T, T, T]

export type Mat4<T = number> = [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]

export type ObjectTypes =
        | 'boxFrame'
        | 'box'
        | 'capsule'
        | 'cone'
        | 'cube'
        | 'cylinder'
        | 'dodecahedron'
        | 'ellipsoid'
        | 'formula'
        | 'hexPrism'
        | 'icosahedron'
        | 'link'
        | 'octahedron'
        | 'octagonPrism'
        | 'plane'
        | 'pyramid'
        | 'sphere'
        | 'tetrahedron'
        | 'torus'
        | 'triPrism'
        // collection
        | 'U'
        | 'I'
        | 'S'
        // Material
        | 'Material'

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
        key: string
        matrix: Mat4
        matrixWorld: Mat4
        position: Vec3 | null
        rotation: Vec3 | null
        parent: PLObject | null
        scale: Vec3 | null
        color: Vec3 | null
        index: number
        active: boolean
        children: PLObject[]
        to: 'U' | 'I' | 'S'

        // shader
        shader: string
        shaderAll: string
        renderAll: string
        _shader: string // compiled result
        compileShader(code: string): void
        changeActive(obj: PLObject, prev: PLObject | null): void
}

export interface PL extends GL {
        error: Error
        object: PLObject
        collection: PLObject | null
        /**
         * Events
         */
        on(): void
        update(): void
        trySuccess(): void
        catchError(e: Error): void
}
