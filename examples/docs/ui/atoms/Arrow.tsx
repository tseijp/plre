import * as React from 'react'
import type { CSSProperties } from 'react'

export const Arrow = (props: CSSProperties) => {
        return (
                <span
                        style={{
                                position: 'relative',
                                width: '1em',
                                height: '1em',
                                ...props,
                        }}
                >
                        <span
                                style={{
                                        content: '',
                                        width: '0.7em', // 1 / sqrt(2)
                                        height: '0.7em', // 1 / sqrt(2)
                                        border: '1px solid currentColor',
                                        borderTop: 0,
                                        borderRight: 0,
                                        transform: 'rotate(-45deg)',
                                        transformOrigin: 'center center',
                                        position: 'absolute',
                                        boxSizing: 'border-box',
                                }}
                        />
                </span>
        )
}
