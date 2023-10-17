import * as React from 'react'
import { useState } from 'react'
import { CrossIcon, Drop, TimerIcon, useHoverEvent } from '../../atoms'

export interface CacheItemProps {
        cacheId: string
        fileName: string
        byteSize: string
        background: string
        onClick: () => void
}

export const CacheItem = (props: CacheItemProps) => {
        const { fileName, byteSize, cacheId, background, onClick } = props
        const [color, set] = useState('white')
        const hover = useHoverEvent((state) => {
                const { active, target } = state
                set(active ? '#3372DB' : 'white')
        })

        return (
                <div
                        ref={hover.ref}
                        onClick={onClick}
                        style={{
                                color,
                                gap: '0.5rem',
                                width: '100%',
                                cursor: 'pointer',
                                padding: '0 0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                background,
                        }}
                >
                        <TimerIcon />
                        <span
                                style={{
                                        width: '8rem',
                                        textOverflow: 'ellipsis',
                                }}
                        >
                                {fileName}
                        </span>

                        <Drop>
                                <span
                                        style={{
                                                width: '2.5rem',
                                                textAlign: 'right',
                                                fontSize: '0.75rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                        }}
                                >
                                        {byteSize}
                                </span>
                                <div>
                                        <CrossIcon cursor="pointer" />
                                        DELTETE
                                </div>
                        </Drop>
                        <span
                                style={{
                                        width: '5rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                }}
                        >
                                {cacheId}
                        </span>
                </div>
        )
}
