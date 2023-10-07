import * as React from 'react'
import { Editable, type EditableProps } from '../../molecules'

export interface LayerItemFieldProps extends EditableProps {
        isEditted: boolean
}

export const LayerItemField = (props: LayerItemFieldProps) => {
        const { isEditted, ...other } = props

        return (
                <Editable
                        double
                        style={{
                                marginLeft: '3px',
                                fontSize: '12px',
                                lineHeight: '20px',
                        }}
                        color={isEditted ? '#F0B72E' : 'white'}
                        {...other}
                />
        )
}
