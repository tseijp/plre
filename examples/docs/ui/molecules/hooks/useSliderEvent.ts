import { useCall, useDragEvent } from '../../atoms'
import type { DragState } from '../../atoms'

type On = (state: DragState) => void

export const useSliderEvent = (_on: On = () => {}) => {
        const on = useCall(_on)
        const drag = useDragEvent((state) => {
                const { active, _active, memo } = state
                memo.isDragStart = active && !_active
                memo.isDragging = active && _active
                memo.isDragEnd = !active && _active
                on(state)
        })

        return drag
}
