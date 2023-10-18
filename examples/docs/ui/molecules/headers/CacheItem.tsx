import * as React from 'react'
import { useState } from 'react'
import { CrossIcon, TimerIcon, useHoverEvent } from '../../atoms'

export interface CacheItemProps {
        cacheId: string
        fileName: string
        byteSize: string
        background: string
        onDelete?(): void
        onClick?(): void
}

const confirm = () => {
        return window.confirm('Are you sure you want to delete this item?')
}

export const CacheItem = (props: CacheItemProps) => {
        const {
                fileName,
                byteSize,
                cacheId,
                background,
                onClick = () => {},
                onDelete = () => {},
        } = props
        const [color, set] = useState('white')
        const hover = useHoverEvent((state) => {
                const { active, target } = state
                set(active ? '#3372DB' : 'white')
        })

        const handleClickDelete = (e: any) => {
                e.stopPropagation()
                if (confirm()) {
                        onDelete()
                        alert('Success')
                }
        }

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
                        <span
                                style={{
                                        width: '2.25rem',
                                        textAlign: 'right',
                                        fontSize: '0.75rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                }}
                        >
                                {byteSize}
                        </span>
                        <span
                                style={{
                                        width: '5rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                }}
                        >
                                {cacheId}
                        </span>
                        <div onClick={handleClickDelete}>
                                <CrossIcon />
                        </div>
                </div>
        )
}
