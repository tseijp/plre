import { createObject } from 'plre'
import { useState } from 'react'

export const createInitCollection = () => {
        // X^2 + y^2 formula
        const xxyy = `x * x + z * z - 1.0`
        const formula = createObject('formula', { shader: xxyy })
        const box = createObject('box')
        const XXYY = createObject('I', { children: [formula, box] })

        // box frame
        const boxFrame = createObject('boxFrame')

        return createObject('U', { children: [boxFrame, XXYY] })
}

export const useInitPLObject = () => {
        const [obj] = useState(createInitCollection)
        return obj
}
