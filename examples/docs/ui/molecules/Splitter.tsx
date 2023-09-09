import * as React from 'react'
import { range, splitEditor, shrinkEditor } from '../utils'
import { useDragEvent } from '../atoms'
import type { CSSProperties } from 'react'
import type { Refs } from '../atoms'
import type { EditorState } from 'plre/types'

const THRESHOLD_DELTA = 100 // 10

const _styles = [
        { top: 0, left: 0 },
        { top: 0, right: 0 },
        { bottom: 0, right: 0 },
        { bottom: 0, left: 0 },
]

const format = (i: number, j: number, row: boolean) => {
        if (row) {
                if (i === 0) return (j + 1) % 4
                else return (j + 3) % 4
        } else {
                if (i === 0) return (j + 2) % 4
                else return j
        }
}

export interface SplitterProps {
        i: number
        w: number
        h: number
        size: number
        rate?: number[]
        row?: boolean
        gap?: number
        top?: boolean
        refs: Refs<HTMLDivElement | null>
        editorItem: EditorState
}

export const Splitter = (props: SplitterProps) => {
        const { i, top, row, refs, editorItem } = props
        return range(top ? 4 : 2).map((j) => {
                j = format(i, j, row)
                return (
                        <SplitterItem
                                key={j}
                                i={i}
                                j={j}
                                row={row}
                                refs={refs}
                                style={_styles[j]}
                                editorItem={editorItem}
                        />
                )
        })
}

export interface SplitterItem {
        i: number
        j: number
        row: boolean
        refs: Refs<HTMLDivElement | null>
        style: CSSProperties
        editorItem: EditorState
}

const { sign } = Math

export const SplitterItem = (props: any) => {
        const { children, i, j, row, style, editorItem } = props
        const k = row ? [-1, 1, 1, -1][j] : [-1, -1, 1, 1][j]

        const split = useDragEvent((state) => {
                const { active, _active, movement, target, event, up } = state
                if (true || (!_active && active)) return // mousedown event
                let [x, y] = movement
                if (row) [x, y] = [y, x]
                const dir = x ** 2 > y ** 2 ? 0 : 1

                // [row ? 0 : 1]
                if (x ** 2 + y ** 2 < THRESHOLD_DELTA ** 2) return

                // split
                if (
                        (dir === 0 && sign(x) === k) ||
                        (dir === 1 && sign(y) === k)
                ) {
                        alert('SPLIT')
                        // splitEditor(editorItem, i, false)
                        target.releasePointerCapture(event.pointerId)
                        up(event)
                        // force update
                        return
                }

                // shrink
                if (_active && active) return
                if (dir === 1 && sign(y) === k) {
                        alert('SHRINK')
                        shrinkEditor(editorItem, i)
                }
        })

        return (
                <div
                        style={{
                                width: 10,
                                height: 10,
                                bottom: 0,
                                zIndex: 1,
                                color: 'white',
                                cursor: 'crosshair',
                                position: 'absolute',
                                // background: 'red',
                                ...style,
                        }}
                        ref={split.ref}
                >
                        {children}
                </div>
        )
}
