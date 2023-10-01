import * as React from 'react'
import { LayerItemIcon } from '../../molecules'
import { useCompile } from '../hooks'

export const CompileStart = () => {
        const compile = useCompile()

        return (
                <div style={{ cursor: 'pointer' }} onClick={compile}>
                        <LayerItemIcon active children="▶️" />
                </div>
        )
}
