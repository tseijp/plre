import * as React from 'react'
import { useState } from 'react'
import { Field } from '../atoms/Field'
import { useFieldEvent } from '../molecules/hooks/useFieldEvent'
import { useCall } from '../atoms/hooks/useCall'
import type { ReactNode } from 'react'

export interface EditableProps {
        value: string | number
        double?: boolean
        color?: string
        children?: ReactNode
        style?: React.CSSProperties
        fieldStyle?: React.CSSProperties
        onChange?(value: string | number): void
}

export const Editable = (props: EditableProps) => {
        const { value, style, color, children, onChange, double, fieldStyle } =
                props
        const [isActive, set] = useState(false)

        const handleFinish = useCall(() => {
                set(false)
                if (field.value === value) return
                onChange?.(field.value)
        })

        const handleClick = useCall(() => {
                set(true)
                field.value = value
                setTimeout(() => {
                        field.target.focus()
                        field.target.select()
                }, 1)
        })

        const field = useFieldEvent(handleFinish)

        React.useEffect(() => {
                // @ts-ignore change input value if change parent props value
                field.target.value = value
        }, [value])

        return (
                <div style={style}>
                        <div
                                style={{
                                        display: isActive ? 'none' : '',
                                        userSelect: 'none',
                                        color,
                                }}
                                onClick={double ? void 0 : handleClick}
                                onDoubleClick={double ? handleClick : void 0}
                        >
                                {children}
                        </div>
                        <Field
                                // @ts-ignore
                                ref={field.ref}
                                color={color}
                                value={value}
                                display={isActive ? '' : 'none'}
                                {...fieldStyle}
                        />
                </div>
        )
}
