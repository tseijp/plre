import * as React from 'react'
import { LayerItemIcon } from '../layers'
import { useCompile } from '../hooks'

export const CompileStart = () => {
        const compile = useCompile()
        const handleClick = () => void compile()

        return (
                <div style={{ cursor: 'pointer' }} onClick={handleClick}>
                        <LayerItemIcon active children="▶️" />
                </div>
        )
}
