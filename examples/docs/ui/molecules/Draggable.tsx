import * as React from 'react'
import { useState } from 'react'
import { gsap } from 'gsap'
import { DragState, useDragEvent } from '../atoms'
import type { ReactNode } from 'react'

export interface DraggableProps {
        isOpen?: boolean
        children?: ReactNode
        onDrag?(drag: DragState): void
}

export const Draggable = (props: DraggableProps) => {
        const { children, onDrag = () => {} } = props
        const [isActived, setIsActived] = useState(false)

        const drag = useDragEvent(() => {
                setIsActived(drag.active)
                onDrag(drag)
                const [x, y] = drag.movement
                gsap.to(drag.target, {
                        x: drag.active ? x + 25 : 0,
                        y: drag.active ? y : 0,
                })
        })

        return (
                <div style={{ cursor: isActived ? 'grabbing' : 'grab' }}>
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
                                        pointerEvents: 'none',
                                        display: isActived ? '' : 'none',
                                }}
                        >
                                {children}
                        </div>
                </div>
        )
}
