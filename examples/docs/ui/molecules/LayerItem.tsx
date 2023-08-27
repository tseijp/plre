import * as React from 'react'
import type { ReactNode } from 'react'

export interface LayerItemProps {
        children?: ReactNode
        index?: number
}

export const LayerItem = (props: LayerItemProps) => {
        const { children, index = 0 } = props
        return (
                <div style={{ paddingLeft: index + 'rem' }}>
                        {index}
                        {children}
                </div>
        )
}
