import * as React from 'react'
import Head from '@docusaurus/Head'
import LayoutImpl from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { Tree, Debug, Flex } from '../atoms'
import { Separate } from '../molecules'
import { Properties, Timeline, ViewLayer, Viewport } from '../organisms'
import { useInitPLObject, useInitPLEditor } from './hooks'
import { HEADER_PADDING_SIZE, LAYOUT_PADDING_STYLE } from '../utils'
import type { EditorState } from 'plre/types'
import type { ReactNode } from 'react'

export const Layout = () => {
        const { siteConfig } = useDocusaurusContext()
        const objectTree = useInitPLObject()
        const editorTree = useInitPLEditor()

        const render = (editorItem: EditorState, grandChild: ReactNode) => {
                const props = { editorItem, editorTree }

                switch (editorItem.type) {
                        case 'viewport':
                                return <Viewport {...props} />
                        case 'viewlayer':
                                return (
                                        <ViewLayer
                                                {...props}
                                                objectTree={objectTree}
                                        />
                                )
                        case 'timeline':
                                return <Timeline {...props} />
                        case 'properties':
                                return <Properties {...props} />
                        case 'I':
                                return (
                                        <Separate {...props}>
                                                {grandChild}
                                        </Separate>
                                )
                        default:
                                return <Flex background="#3A3A3A" />
                }
        }

        return (
                <LayoutImpl noFooter>
                        <Head>
                                <title>
                                        {siteConfig.title}{' '}
                                        {siteConfig.titleDelimiter}{' '}
                                        {siteConfig.tagline}{' '}
                                </title>
                        </Head>
                        <Flex
                                position="absolute"
                                paddingTop={HEADER_PADDING_SIZE}
                                padding={LAYOUT_PADDING_STYLE}
                                backgroundColor="#161616"
                        >
                                <Tree tree={editorTree}>{render}</Tree>
                        </Flex>
                        <Debug />
                </LayoutImpl>
        )
}
