import type { GL } from 'glre/types'

export type Vec3<T = number> = [T, T, T]

export type Mat4<T = number> = [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]

export type ObjectTypes =
        | 'object'
        | 'boxFrame'
        | 'box'
        | 'capsule'
        | 'cone'
        | 'cylinder'
        | 'dodecahedron'
        | 'ellipsoid'
        | 'formula'
        | 'hexPrism'
        | 'icosahedron'
        | 'link'
        | 'octahedron'
        | 'octogonPrism'
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
        // Material @TODO add more
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
        children: EditorState[]
        memo: any
        // events
        forceUpdate?(): void
        trySuccess?(): void
        catchError?(e: Error): void
        changeActive?(obj: ObjectState): void
        compileShader?(code: string): void
        updateUniform?(obj: ObjectState): void
}

export interface ObjectState {
        type: ObjectTypes
        id: string
        key: string
        matrix: Mat4
        matrixWorld: Mat4
        position: Vec3
        rotation: Vec3
        parent: ObjectState | null
        scale: Vec3
        color: Vec3
        index: number
        active: boolean
        children: ObjectState[]
        to: 'U' | 'I' | 'S'
        memo: any

        // shader
        shader: string
        shaderAll: string
        geometryAll: string
        materialAll: string
        collectionAll: string
        renderAll: string
        isEditted: boolean
        _shader: string // compiled result
        forceUpdate(): void
}

export interface PL extends GL {
        error: Error
        object: ObjectState
        collection: ObjectState | null
        memo: any
        /**
         * Events
         */
        on(): void
        update(): void
}
