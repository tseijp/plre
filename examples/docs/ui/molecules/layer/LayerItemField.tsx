import * as React from 'react'
import { useState } from 'react'
import { Field } from '../../atoms/Field'
import { useFieldEvent } from '../hooks/useFieldEvent'
import { useCall } from '../../atoms/hooks/useCall'
import type { ReactNode } from 'react'

export interface LayerItemFieldProps {
        objId: string
        children: ReactNode
        onChange?(value: string): void
}

export const LayerItemField = (props: LayerItemFieldProps) => {
        const { objId, children, onChange } = props

        const on = useCall(() => {
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
        const [value, setValue] = useState(objId)
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
                                {children}
                        </div>
                        <Field
                                // @ts-ignore
                                ref={field.ref}
                                height="20px"
                                display={isActive ? '' : 'none'}
                                value={objId}
                        />
                </div>
        )
}
