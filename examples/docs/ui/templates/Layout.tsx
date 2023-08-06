import * as React from 'react'
import Head from '@docusaurus/Head'
import LayoutImpl from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { Flex } from '../atoms/Flex'
import { Box } from '../atoms/Box'
import { Properties } from '../organisms/Properties'
import { Timeline } from '../organisms/Timeline'
import { ViewLayer } from '../organisms/ViewLayer'
import { Viewport } from '../organisms/Viewport'
import { useWindowSize } from '../hooks/useWindowSize'

export const Layout = () => {
        const { siteConfig } = useDocusaurusContext()
        let [w, h, g = 3] = useWindowSize()
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
                        <Flex
                                row
                                background="#161616"
                                gap={g}
                                cursor="col-resize"
                                padding={`${g}px ${g}px`}
                        >
                                <Box basis={(w - g) * 0.83}>
                                        <Flex gap={g} cursor="row-resize">
                                                <Box basis={(h - g) * 0.92}>
                                                        <Viewport />
                                                </Box>
                                                <Box basis={h * 0.08}>
                                                        <Timeline />
                                                </Box>
                                        </Flex>
                                </Box>
                                <Box basis={(w - g) * 0.17}>
                                        <Flex gap={g} cursor="row-resize">
                                                <Box basis={(h - g) * 0.33}>
                                                        <ViewLayer />
                                                </Box>
                                                <Box basis={(h - g) * 0.67}>
                                                        <Properties />
                                                </Box>
                                        </Flex>
                                </Box>
                        </Flex>
                        <img
                                src="/img/debug.png"
                                style={{
                                        position: 'fixed',
                                        width: `${1279}px`,
                                        pointerEvents: 'none',
                                        opacity: 0.5,
                                        top: `10px`,
                                }}
                        />
                </LayoutImpl>
        )
}
