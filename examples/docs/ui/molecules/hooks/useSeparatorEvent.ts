import { useRef, useEffect } from 'react'
import { DragState, useCall, useDragEvent, useWindowSize } from '../../atoms'

export interface SeparatorEventHandlers {
        onMove(duration?: number): void
        onMount(): void
}

export const useSeparatorEvent = (handlers: SeparatorEventHandlers) => {
        const { onMove, onMount } = handlers
        const [w, h] = useWindowSize()
        const wh = useRef([w, h]).current

        const drag = useDragEvent((state) => {
                if (!state.active) return
                onMove(0.5)
        })

        const resize = useCall(() => {
                const [_w, _h] = wh
                const [_x, _y] = drag.offset
                drag.offset = [(_x * w) / _w, (_y * h) / _h]
                onMove()
                wh[0] = w
                wh[1] = h
        })

        useEffect(() => resize(), [w, h])
        useEffect(() => onMount(), [])

        return drag
}
