import React from 'react'
import Head from '@docusaurus/Head'
import LayoutImpl from '@theme/Layout'
import { Layout } from '../..//ui/templates/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export default function Home() {
        const { siteConfig } = useDocusaurusContext()
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
                        <Layout />
                </LayoutImpl>
        )
}

const _P = `
# # # # # # _
# # _ _ _ # #
# # _ _ _ # #
# # _ _ # # #
# # # # _ _ _
# # _ _ _ _ _
# # _ _ _ _ _
`

const _L = `
# # _ _ _ _ _
# # _ _ _ _ _
# # _ _ _ _ _
# # _ _ _ _ _
# # _ _ _ _ _
# # _ _ _ _ _
# # # # # # #
`

const _R = `
# # # # # # _
# # _ _ _ # #
# # _ _ _ # #
# # _ _ # # #
# # # # # _ _
# # _ # # # _
# # _ _ # # #
`
const _E = `
# # # # # # #
# # _ _ _ _ _
# # _ _ _ _ _
# # # # # # _
# # _ _ _ _ _
# # _ _ _ _ _
# # # # # # #
`

console.log(_P)
console.log(_L)
console.log(_R)
console.log(_E)
