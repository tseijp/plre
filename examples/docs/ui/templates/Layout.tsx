import * as React from 'react'
import Head from '@docusaurus/Head'
import LayoutImpl from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { Flex } from '../atoms/Flex'
import { Box } from '../atoms/Box'
import { Properties } from '../organismss/Properties'
import { Timeline } from '../organismss/Timeline'
import { ViewLayer } from '../organismss/ViewLayer'
import { Viewport } from '../organismss/Viewport'
import { useWindowSize } from '../hooks'

export const Layout = () => {
        const { siteConfig } = useDocusaurusContext()
        let [w, h, g = 4] = useWindowSize()
        h -= 60 // header
        h -= g * 2 // padding
        w -= g * 2 // padding
        return (
                <LayoutImpl noFooter>
                        <Head>
                                <title>
                                        {siteConfig.title}{' '}
                                        {siteConfig.titleDelimiter}{' '}
                                        {siteConfig.tagline}
                                </title>
                        </Head>
                        {/* <img
                                src="/img/debug.png"
                                style={{
                                        position: 'fixed',
                                        width: `${1279}px`,
                                        opacity: 0,
                                        top: `10px`,
                                }}
                        /> */}
                        <Flex
                                row
                                background="#161616"
                                gap={g}
                                padding={`${g}px ${g}px`}
                        >
                                <Box basis={(w - g) * 0.83}>
                                        <Flex gap={g}>
                                                <Box basis={(h - g) * 0.9}>
                                                        <Viewport />
                                                </Box>
                                                <Box basis={h * 0.1}>
                                                        <Timeline />
                                                </Box>
                                        </Flex>
                                </Box>
                                <Box basis={(w - g) * 0.17}>
                                        <Flex gap={g}>
                                                <Box basis={(h - g) * 0.33}>
                                                        <ViewLayer />
                                                </Box>
                                                <Box basis={(h - g) * 0.67}>
                                                        <Properties />
                                                </Box>
                                        </Flex>
                                </Box>
                        </Flex>
                </LayoutImpl>
        )
}
