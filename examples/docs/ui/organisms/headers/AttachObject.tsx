import * as React from 'react'
import { Drop } from '../../atoms'
import { useCtx } from '../../ctx'

export const AttachObject = () => {
        const { objectTree } = useCtx()

        return (
                <Drop>
                        <span
                                style={{
                                        width: 18,
                                        height: 18,
                                        textAlign: 'center',
                                }}
                        ></span>
                </Drop>
        )
}
