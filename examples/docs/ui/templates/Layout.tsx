import * as React from 'react'
import Head from '@docusaurus/Head'
import LayoutImpl from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { Separate } from '../molecules/Separate'
import { Properties } from '../organisms/Properties'
import { Timeline } from '../organisms/Timeline'
import { ViewLayer } from '../organisms/ViewLayer'
import { Viewport } from '../organisms/Viewport'

export const Layout = () => {
        const { siteConfig } = useDocusaurusContext()
        // let [w, h, g = 3] = useWindowSize()
        // h -= 60 // header
        // h -= g * 2 // padding
        // w -= g * 2 // padding
        return (
                <LayoutImpl noFooter>
                        <Head>
                                <title>
                                        {siteConfig.title}{' '}
                                        {siteConfig.titleDelimiter}{' '}
                                        {siteConfig.tagline}
                                </title>
                        </Head>
                        <Separate top row rate={[0.83, 0.17]}>
                                <Separate rate={[0.92, 0.08]}>
                                        <Viewport />
                                        <Timeline />
                                </Separate>
                                <Separate rate={[0.33, 0.67]}>
                                        <ViewLayer />
                                        <Properties />
                                </Separate>
                        </Separate>
                        {/* <img
                                src="/img/debug.png"
                                style={{
                                        position: 'fixed',
                                        width: `${1279}px`,
                                        pointerEvents: 'none',
                                        opacity: 0.5,
                                        top: `10px`,
                                }}
                        /> */}
                </LayoutImpl>
        )
}
