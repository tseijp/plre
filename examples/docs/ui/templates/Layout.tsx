import * as React from 'react'
import Head from '@docusaurus/Head'
import LayoutImpl from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
// import { Debug } from '../atoms'
import { Tree, Flex } from '../atoms'
import { Separate } from '../molecules'
import {
        Properties,
        Timeline,
        ViewLayer,
        Viewport,
        UserCursors,
} from '../organisms'
import { useInitPLObject, useInitPLEditor, useInitWebrtc } from './hooks'
import { HEADER_PADDING_SIZE, LAYOUT_PADDING_STYLE } from '../utils'
import type { EditorState } from 'plre/types'
import type { ReactNode } from 'react'
import { CtxProvider } from '../ctx'

export const Layout = () => {
        const { siteConfig } = useDocusaurusContext()
        const objectTree = useInitPLObject()
        const editorTree = useInitPLEditor()
        const webrtcTree = useInitWebrtc()

        const render = (editorItem: EditorState, grandChild: ReactNode) => {
                switch (editorItem.type) {
                        case 'viewport':
                                return <Viewport editorItem={editorItem} />
                        case 'viewlayer':
                                return <ViewLayer editorItem={editorItem} />
                        case 'timeline':
                                return <Timeline editorItem={editorItem} />
                        case 'properties':
                                return <Properties editorItem={editorItem} />
                        case 'I':
                                return (
                                        <Separate editorItem={editorItem}>
                                                {grandChild}
                                        </Separate>
                                )
                        default:
                                return <Flex background="#3A3A3A" />
                }
        }

        return (
                <LayoutImpl noFooter>
                        <CtxProvider
                                value={{ objectTree, editorTree, webrtcTree }}
                        >
                                <Head>
                                        <title>
                                                {siteConfig.title}{' '}
                                                {siteConfig.titleDelimiter}{' '}
                                                {siteConfig.tagline}{' '}
                                        </title>
                                </Head>
                                <Flex position="absolute">
                                        <UserCursors />
                                </Flex>
                                <Flex
                                        position="absolute"
                                        paddingTop={HEADER_PADDING_SIZE}
                                        padding={LAYOUT_PADDING_STYLE}
                                        backgroundColor="#161616"
                                >
                                        <Tree tree={editorTree}>{render}</Tree>
                                </Flex>
                                {/* <Debug /> */}
                        </CtxProvider>
                </LayoutImpl>
        )
}
