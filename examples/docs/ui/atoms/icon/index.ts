import { EditorType, ObjectTypes } from 'plre/types'
import { AvatarIcon } from './AvatarIcon'
import { CrossIcon } from './CrossIcon'
import { CodeIcon } from './CodeIcon'
import { FrameIcon } from './FrameIcon'
import { LayersIcon } from './LayersIcon'
import { ShadowIcon } from './ShadowIcon'
import { OperationIIcon } from './OperationIIcon'
import { OperationSIcon } from './OperationSIcon'
import { OperationUIcon } from './OperationUIcon'

import { TransformIcon } from './TransformIcon'
import { LaptopIcon } from './LaptopIcon'

export const WINDOW_ICONS: Partial<Record<EditorType, any>> = {
        viewport: FrameIcon,
        timeline: AvatarIcon,
        viewlayer: LayersIcon,
        properties: CodeIcon,
        tutorial: LaptopIcon,
}

export const OBJECT_ICONS: Partial<Record<ObjectTypes, any>> = {
        object: TransformIcon,
        boxFrame: TransformIcon,
        box: TransformIcon,
        capsule: TransformIcon,
        cone: TransformIcon,
        cylinder: TransformIcon,
        dodecahedron: TransformIcon,
        ellipsoid: TransformIcon,
        formula: TransformIcon,
        hexPrism: TransformIcon,
        icosahedron: TransformIcon,
        link: TransformIcon,
        octahedron: TransformIcon,
        octogonPrism: TransformIcon,
        plane: TransformIcon,
        pyramid: TransformIcon,
        sphere: TransformIcon,
        tetrahedron: TransformIcon,
        torus: TransformIcon,
        triPrism: TransformIcon,
        // collection
        U: OperationUIcon,
        I: OperationIIcon,
        S: OperationSIcon,
        // // Material @TODO add more
        Material: ShadowIcon,
}

export const ATTACH_ICONS = {
        Delete: CrossIcon,
        'Add Union': OperationUIcon,
        'Add Intersection': OperationIIcon,
        'Add Subtraction': OperationSIcon,
        'Add Material': ShadowIcon,
        'Add Landscape': ShadowIcon,
        'Add Tetrahedron': ShadowIcon,
        'Add MengerSponge': ShadowIcon,
        'Add Mandelbulb': ShadowIcon,
        'Add QuaternionMandelbrot': ShadowIcon,
        'Add QuaternionJuliaSet': ShadowIcon,
        'Add QuaternionSet': ShadowIcon,
}

export * from './AvatarIcon'
export * from './CodeIcon'
export * from './CopyIcon'
export * from './CrossIcon'
export * from './DownloadIcon'
// export * from './EnterFullscreenIcon'
// export * from './ExitFullscreenIcon'
export * from './FrameIcon'
export * from './LayersIcon'
export * from './MixerHorizontalIcon'
export * from './MixerVerticalIcon'
export * from './OpenInNewWindowIcon'
export * from './OperationIIcon'
export * from './OperationSIcon'
export * from './OperationUIcon'
export * from './PersonIcon'
export * from './ShadowIcon'
export * from './TimerIcon'
export * from './TransformIcon'
export * from './UploadIcon'
