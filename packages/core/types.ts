import type { GL } from 'glre/types'

export type Vec3<T = number> = [T, T, T]

export type Mat4<T = number> = [T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T]

export type ObjectTypes =
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
        changeActive?(obj: PLObject): void
        compileShader?(code: string): void
}

export interface PLObject {
        type: ObjectTypes
        id: string
        key: string
        matrix: Mat4
        matrixWorld: Mat4
        position: Vec3
        rotation: Vec3
        parent: PLObject | null
        scale: Vec3
        color: Vec3
        index: number
        active: boolean
        children: PLObject[]
        to: 'U' | 'I' | 'S'
        memo: any

        // shader
        shader: string
        shaderAll: string
        renderAll: string
        isEditted: boolean
        _shader: string // compiled result

        // events
        px(value?: number): void
        py(value?: number): void
        pz(value?: number): void
        rx(value?: number): void
        ry(value?: number): void
        rz(value?: number): void
        sx(value?: number): void
        sy(value?: number): void
        sz(value?: number): void
        forceUpdate(): void
}

export interface PL extends GL {
        error: Error
        object: PLObject
        collection: PLObject | null
        memo: any
        /**
         * Events
         */
        on(): void
        update(): void
}
