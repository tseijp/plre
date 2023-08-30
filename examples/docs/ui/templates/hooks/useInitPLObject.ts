import { createObject } from 'plre'
import { useState } from 'react'

// export const createInitCollection = () => {
//         // X^2 + y^2 formula
//         const shader = `x * x + z * z - 1.0`
//         const formula = createObject('formula', { shader })
//         const box = createObject('box')
//         const xxyy = createObject('I', { children: [formula, box] })

//         // box frame
//         const boxFrame = createObject('boxFrame')

//         return createObject('U', { children: [boxFrame, xxyy] })
// }

export const createInitCollection = () => {
        const Camera = createObject('I', { id: 'Camera' })
        const Cube = createObject('I', { id: 'Cube', active: true })
        const Light = createObject('I', { id: 'Light' })
        const Collection = createObject('U', { id: 'Collection' }, [
                Camera,
                Cube,
                Light,
        ])
        const SceneCollection = createObject('U', {
                id: 'Scene Collection',
                children: Collection,
        })
        return SceneCollection
}

export const useInitPLObject = () => {
        const [obj] = useState(createInitCollection)
        return obj
}
