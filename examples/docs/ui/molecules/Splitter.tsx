import * as React from 'react'
import { range } from '../utils'
import { useSplitterEvent } from './hooks'
import type { CSSProperties } from 'react'
import type { SplitterEventHandlers } from './hooks'

const _styles = [
        { userSelect: 'none', top: 0, left: 0 },
        { userSelect: 'none', top: 0, right: 0 },
        { userSelect: 'none', bottom: 0, right: 0 },
        { userSelect: 'none', bottom: 0, left: 0 },
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
        row?: boolean
        top?: boolean
        handlers: SplitterEventHandlers
}

export const Splitter = (props: SplitterProps) => {
        const { i, top, row, handlers } = props
        return range(top ? 4 : 2).map((j) => {
                j = format(i, j, row)
                return (
                        <SplitterItem
                                key={j}
                                i={i}
                                j={j}
                                row={row}
                                style={_styles[j]}
                                handlers={handlers}
                        />
                )
        })
}

export interface SplitterItem {
        i: number
        j: number
        row: boolean
        style: CSSProperties
        handlers: SplitterEventHandlers
}

export const SplitterItem = (props: any) => {
        const { children, i, j, row, style, handlers } = props

        const split = useSplitterEvent(i, j, row, handlers)
        return (
                <div
                        style={{
                                width: 15,
                                height: 15,
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
