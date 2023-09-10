import { useDragEvent } from '../../atoms'
import {
        xyDir,
        isSplit,
        isShrink,
        isCancelShrink,
        isReverseShrink,
        cursor,
} from './utils'

const THRESHOLD_DELTA = 10

export interface SplitterEventHandlers {
        onSplit(i: number, j: number, row: boolean): void
        onShrinkEnd(i: number): void
        onShrinkStart(i: number): void
        onShrinkCancel(): void
}

export const useSplitterEvent = (
        i: number,
        j: number,
        row: boolean,
        handlers: SplitterEventHandlers
) => {
        const { onSplit, onShrinkEnd, onShrinkStart, onShrinkCancel } = handlers
        const split = useDragEvent<HTMLDivElement>((state) => {
                const { active, _active, movement, target, event, memo } = state
                if (!_active && active) return // pointerdown event
                let [x, y] = movement
                let dir = xyDir(x, y)

                // override dir if previous shrinking
                if (memo._shrinking) dir = xyDir(row ? x : 0, row ? 0 : y)

                memo._spliting = memo.spliting
                memo._shrinking = memo.shrinking
                memo.moving = _active && active
                memo.moveend = _active && !active
                memo.spliting = isSplit(dir, j)
                memo.shrinking = isShrink(dir, i, j, row)
                memo.active = x ** 2 + y ** 2 > THRESHOLD_DELTA ** 2

                // cancel with threshold and previous not spliting and not shrinking
                if (!memo.active && !memo._spliting && !memo._shrinking)
                        return reset()

                // override spliting = false if previous shrinking
                if (memo._shrinking) {
                        memo.cancel = isCancelShrink(x, y, i, j, row)
                        memo.reverse = isReverseShrink(dir, i, j, row)
                        memo.spliting = false
                        memo.shrinking = true
                }

                if (memo.spliting) {
                        if (!memo.moving) return
                        onSplit(i, j, dir === 1 || dir === 3)
                        target.releasePointerCapture(event.pointerId)
                        return reset()
                }

                if (memo.shrinking) {
                        const sign = dir === 0 || dir === 3 ? -1 : 1
                        const shrinkId = memo.reverse ? i : i + sign
                        const expandId = memo.reverse ? i - sign : i
                        if (memo.moving) {
                                if (memo.cancel) {
                                        onShrinkStart(null)
                                        target.style.cursor = 'not-allowed'
                                } else {
                                        onShrinkStart(shrinkId)
                                        target.style.cursor = cursor(sign, row)
                                }
                        } else if (memo.moveend) {
                                if (!memo.cancel) onShrinkEnd(expandId)
                                target.releasePointerCapture(event.pointerId)
                                reset()
                        }
                }
        })

        const reset = () => {
                const { memo, target } = split
                onShrinkCancel()
                memo.cancel = memo.reverse = false
                memo.spliting = memo.shrinking = false
                memo._spliting = memo._shrinking = false
                target.style.cursor = 'crosshair'
        }
        return split
}
