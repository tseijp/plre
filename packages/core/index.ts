import { createGL } from 'glre'
import { PL } from './types'

export const createPL = (props?: Partial<PL>) => {
        const self = createGL({
                mount() {
                        self(props)
                },
                clean() {
                        self(props)
                },
        }) as PL
        return self
}

export const pl = createPL()

export default pl
