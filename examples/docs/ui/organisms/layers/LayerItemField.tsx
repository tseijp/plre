import * as React from 'react'
import { useState } from 'react'
import { Field } from '../../atoms/Field'
import { useFieldEvent } from '../../molecules/hooks/useFieldEvent'
import { useCall } from '../../atoms/hooks/useCall'
import type { ReactNode } from 'react'

export interface LayerItemFieldProps {
        isEditted: boolean
        value: string
        children: ReactNode
        onChange?(value: string): void
}

export const LayerItemField = (props: LayerItemFieldProps) => {
        const { isEditted, value, children, onChange } = props

        const onFieldEventFinish = useCall(() => {
                setIsActive(false)
                if (field.value === value) return
                onChange?.(field.value)
        })

        const handleDoubleClick = () => {
                setIsActive(true)
                field.value = value
                setTimeout(() => field.target.focus(), 1)
        }

        const [isActive, setIsActive] = useState(false)
        const field = useFieldEvent(onFieldEventFinish)

        return (
                <div
                        style={{
                                marginLeft: '3px',
                                fontSize: '12px',
                                lineHeight: '20px',
                                color: isEditted ? '#F0B72E' : 'white',
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
                                color={isEditted ? '#F0B72E' : 'white'}
                                display={isActive ? '' : 'none'}
                                value={value}
                        />
                </div>
        )
}
