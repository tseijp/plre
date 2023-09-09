import { useDragEvent } from '../../atoms'
import { xyDir } from '../../utils'

const THRESHOLD_DELTA = 100 // 10

export interface SplitterEventHandlers {
        onSplit: (i: number, j: number, row: boolean) => void
        onShrinkEnd: (i: number) => void
        onShrinkStart: (i: number) => void
}

export const useSplitterEvent = (
        i: number,
        j: number,
        row: boolean,
        { onSplit, onShrinkEnd, onShrinkStart }: SplitterEventHandlers
) => {
        const split = useDragEvent((state) => {
                const { active, _active, movement, target, event, up } = state
                if (!_active && active) return // mousedown event
                let [x, y] = movement
                const dir = xyDir(x, y)

                // [row ? 0 : 1]
                if (x ** 2 + y ** 2 < THRESHOLD_DELTA ** 2) return

                if (isSplit(dir, j)) {
                        target.releasePointerCapture(event.pointerId)
                        up(event)
                        const _row = dir === 1 || dir === 3
                        onSplit(i, j, _row)
                } else if (isShrink(dir, i, j, row)) {
                        target.releasePointerCapture(event.pointerId)
                        onShrinkStart(i)
                        setTimeout(() => {
                                onShrinkEnd(i)
                        }, 0)
                }
        })
        return split
}

const isSplit = (dir = 0, j = 0) => {
        if (j === 0) return dir === 1 || dir === 2
        if (j === 1) return dir === 2 || dir === 3
        if (j === 2) return dir === 3 || dir === 0
        if (j === 3) return dir === 0 || dir === 1
}

const isShrink = (dir: number, i: number, j: number, row: boolean) => {
        if (row) {
                if (i % 2) return (j === 0 || j === 3) && dir === 3
                else return (j === 1 || j === 2) && dir === 1
        } else {
                if (i % 2) return (j === 0 || j === 1) && dir === 0
                else return (j === 2 || j === 3) && dir === 2
        }
}
