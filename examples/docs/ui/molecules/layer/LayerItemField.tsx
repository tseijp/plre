import * as React from 'react'
import { useState } from 'react'
import { Field } from '../../atoms/Field'
import { useFieldEvent } from '../hooks/useFieldEvent'
import { useCallback } from '../../atoms/hooks/useCallback'
import { Draggable } from '../Draggable'
import type { ReactNode } from 'react'

export interface LayerItemFieldProps {
        children: ReactNode
        onChange?: (value: string) => void
}

export const LayerItemField = (props: LayerItemFieldProps) => {
        const { children, onChange } = props
        if (typeof children !== 'string') return

        const on = useCallback(() => {
                if (field.value !== value) onChange?.(field.value)
                setValue(field.value)
                setIsActive(false)
        })

        const handleDoubleClick = () => {
                setIsActive(true)
                field.value = value
                setTimeout(() => field.target.focus(), 1)
        }

        const [isActive, setIsActive] = useState(false)
        const [value, setValue] = useState(children)
        const field = useFieldEvent(on)

        return (
                <div
                        style={{
                                marginLeft: '3px',
                                fontSize: '12px',
                                lineHeight: '20px',
                        }}
                >
                        <div
                                style={{ display: isActive ? 'none' : '' }}
                                onDoubleClick={handleDoubleClick}
                        >
                                <Draggable>{value}</Draggable>
                        </div>
                        <Field
                                // @ts-ignore
                                ref={field.ref}
                                height="20px"
                                display={isActive ? '' : 'none'}
                                value={children}
                        />
                </div>
        )
}
