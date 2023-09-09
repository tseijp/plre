import { useRef, useEffect } from 'react'
import { useCall, useDragEvent } from '../../atoms'

export const useSeparatorEvent = (w = 0, h = 0, on = (_duration = 0) => {}) => {
        const wh = useRef([w, h]).current

        const move = useCall(on)

        const drag = useDragEvent((state) => {
                if (!state.active) return
                move(0.5)
        })

        const resize = useCall(() => {
                const [_w, _h] = wh
                const [_x, _y] = drag.offset
                drag.offset = [(_x * w) / _w, (_y * h) / _h]
                move()
                wh[0] = w
                wh[1] = h
        })

        useEffect(() => {
                window.addEventListener('resize', resize)
                return () => {
                        window.removeEventListener('resize', resize)
                }
        }, [])

        return drag
}
