import * as React from 'react'
import { Flex } from '../atoms'
import type { ReactNode } from 'react'
import type { EditorType } from 'plre/types'

export interface EditorTypesProps {
        children?: ReactNode
        onClick: (type: EditorType) => void
}

export const EditorTypes = (props: EditorTypesProps) => {
        const { onClick = () => {} } = props
        return (
                <Flex
                        gap="0.25rem"
                        color="white"
                        cursor="pointer"
                        padding="0.5rem"
                        alignItems="start"
                        borderRadius="3px"
                >
                        <div onClick={() => onClick('viewport')}>Viewport</div>
                        <div onClick={() => onClick('viewlayer')}>
                                Viewlayer
                        </div>
                        <div onClick={() => onClick('timeline')}>Timeline</div>
                        <div onClick={() => onClick('properties')}>
                                Properties
                        </div>
                </Flex>
        )
}
