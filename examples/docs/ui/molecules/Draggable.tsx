import * as React from 'react'
import { useState } from 'react'
import { gsap } from 'gsap'
import { DragState, useDragEvent } from '../atoms'
import type { ReactNode } from 'react'

export interface DraggableProps {
        isOpen?: boolean
        children?: ReactNode
        onDragEnd?(drag: DragState): void
        onDraging?(drag: DragState): void
}

export const Draggable = (props: DraggableProps) => {
        const { children, onDraging = () => {}, onDragEnd = () => {} } = props
        const [isActived, setIsActived] = useState(false)
        const drag = useDragEvent(() => {
                const { active, _active, memo } = drag
                setIsActived(active)
                if (!_active && active) return (memo.i = 0)
                memo.i++
                if (memo.i <= 10) return

                if (_active && active) onDraging(drag)
                if (_active && !active) onDragEnd(drag)
                const [x, y] = drag.movement
                gsap.to(drag.target, {
                        x: drag.active ? x : 0,
                        y: drag.active ? y + 25 : 0,
                })
        })

        return (
                <div style={{ cursor: isActived ? 'grabbing' : 'grab' }}>
                        <div
                                style={{
                                        position: 'absolute',
                                        width: '100%',
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
