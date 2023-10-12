import { useDragEvent, type WheelState } from '../../atoms'

export const useZoomEvent = (wheel: WheelState, isPlus = false) => {
        const drag = useDragEvent((state) => {
                const { target, active, delta, _active, memo } = state
                const isDragStart = active && !_active
                const isDragging = active && _active
                const isDragEnd = !active && _active
                if (isDragStart) memo.i = 0
                else memo.i++

                if (memo.i === 4) {
                        // @ts-ignore
                        target.style.cursor = 'all-scroll'
                }

                if (isDragging && memo.i >= 4) {
                        const { memo } = wheel
                        const [_, dy] = delta
                        memo.rad = memo.rad + dy / 10
                        wheel.active = true
                        wheel.on(wheel)
                        wheel.active = false
                }

                if (isDragEnd) {
                        // @ts-ignore
                        target.style.cursor = 'pointer'
                        if (memo.i <= 3) {
                                const { memo } = wheel
                                memo.rad = memo.rad * (isPlus ? 1 / 2 : 2)
                                wheel.active = true
                                wheel.on(wheel)
                                wheel.active = false
                        }
                }
        })
        return drag
}
