import * as React from 'react'
import { useState } from 'react'
import { gsap } from 'gsap'
import { useDragEvent } from '../atoms'
import type { ReactNode } from 'react'

export interface DraggableProps {
        isOpen?: boolean
        children?: ReactNode
}

export const Draggable = (props: DraggableProps) => {
        const { children } = props
        const [isActived, setIsActived] = useState(true)

        const drag = useDragEvent(() => {
                setIsActived(drag.active)
                const [x, y] = drag.movement
                gsap.to(drag.target, {
                        x: drag.active ? x : 0,
                        y: drag.active ? y : 0,
                })
        })

        return (
                <div>
                        <div
                                style={{
                                        position: 'absolute',
                                        opacity: isActived ? 0.5 : 1,
                                }}
                                ref={drag.ref}
                        >
                                {children}
                        </div>
                        <div
                                style={{
                                        position: 'absolute',
                                        display: isActived ? '' : 'none',
                                }}
                        >
                                {children}
                        </div>
                </div>
        )
}
