import { createObject } from 'plre'
import { useOnce } from '../../atoms'

export const createInitPLObject = () => {
        // X^2 + y^2 formula
        const shader = `x * x + z * z - 1.0`
        const formula = createObject('formula', { shader })
        const box = createObject('box')
        const xxyy = createObject('I', { children: [formula, box] })

        // box frame
        const boxFrame = createObject('boxFrame')

        return createObject('U', { children: [boxFrame, xxyy] })
}

// export const createInitPLObject = () => {
//         const Camera = createObject('I', { id: 'Camera' })
//         const Cube = createObject('I', { id: 'Cube', active: true })
//         const Light = createObject('I', { id: 'Light' })
//         const Collection = createObject('U', { id: 'Collection' }, [
//                 Camera,
//                 Cube,
//                 Light,
//         ])
//         const SceneCollection = createObject('U', {
//                 id: 'Scene Collection',
//                 children: Collection,
//         })
//         return SceneCollection
// }

export const useInitPLObject = () => {
        return useOnce(createInitPLObject)
}
