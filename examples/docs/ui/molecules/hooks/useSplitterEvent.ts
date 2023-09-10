import { useDragEvent } from '../../atoms'
import { xyDir } from '../../utils'

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

const isSplit = (dir = 0, j = 0) => {
        if (j === 0) return dir === 1 || dir === 2
        if (j === 1) return dir === 2 || dir === 3
        if (j === 2) return dir === 3 || dir === 0
        if (j === 3) return dir === 0 || dir === 1
}

const isShrink = (dir: number, i: number, j: number, row: boolean) => {
        if (row) {
                if (i % 2) {
                        return (j === 0 || j === 3) && dir === 3
                } else return (j === 1 || j === 2) && dir === 1
        } else {
                if (i % 2) {
                        return (j === 0 || j === 1) && dir === 0
                } else return (j === 2 || j === 3) && dir === 2
        }
}

const isReverseShrink = (dir: number, i: number, j: number, row: boolean) => {
        if (row) {
                if (i % 2) {
                        return (j === 0 || j === 3) && dir === 1
                } else return (j === 1 || j === 2) && dir === 3
        } else {
                if (i % 2) {
                        return (j === 0 || j === 1) && dir === 2
                } else return (j === 2 || j === 3) && dir === 0
        }
}

const isCancelShrink = (
        x: number,
        y: number,
        i: number,
        j: number,
        row: boolean
) => {
        if (row) {
                if (i % 2) {
                        if (j === 0) return y < 0 // dir === 0
                        if (j === 3) return y > 0 // dir === 2
                } else {
                        if (j === 1) return y < 0 // dir === 0
                        if (j === 2) return y > 0 // dir === 2
                }
        } else {
                if (i % 2) {
                        if (j === 1) return x > 0 // dir === 1
                        if (j === 0) return x < 0 // dir === 3
                } else {
                        if (j === 2) return x > 0 // dir === 1
                        if (j === 4) return x < 0 // dir === 3
                }
        }
}

const cursor = (sign: number, row = false) => {
        if (row) {
                if (sign === 1) {
                        return 'e-resize'
                } else return 'w-resize'
        } else {
                if (sign === 1) {
                        return 's-resize'
                } else return 'n-resize'
        }
}
