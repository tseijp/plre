import { createElement, forwardRef } from 'react'
import type { ChangeEvent, CSSProperties, RefObject } from 'react'

export interface FieldProps extends CSSProperties {
        as?: any
        value?: string | number
        placeholder?: string
        onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

type Ref = RefObject<HTMLInputElement>

export const Field = forwardRef((props: FieldProps, ref: Ref) => {
        const {
                as = 'input',
                value = '',
                onChange,
                width = '100%',
                height = '100%',
                margin = 0,
                padding = 0,
                resize = 'none',
                border = 'none',
                outline = 'none',
                placeholder = '',
                fontSize = 'inherit',
                background = 'none',
                fontFamily = 'inherit',
                ...other
        } = props
        const style = {
                width,
                height,
                margin,
                padding,
                resize,
                border,
                outline,
                fontSize,
                background,
                fontFamily,
                ...other,
        }
        return createElement(as, {
                ref,
                style,
                placeholder,
                defaultValue: value,
                onChange,
        })
})
