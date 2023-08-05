import React from 'react'
import Head from '@docusaurus/Head'
import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export default function Home() {
        const { siteConfig } = useDocusaurusContext()
        return (
                <Layout noFooter>
                        <Head>
                                <title>
                                        {siteConfig.title}{' '}
                                        {siteConfig.titleDelimiter}{' '}
                                        {siteConfig.tagline}
                                </title>
                        </Head>
                        <img
                                src="/img/debug.png"
                                style={{
                                        position: 'absolute',
                                        width: `${1279}px`,
                                        // opacity: 0.5,
                                        top: `10px`,
                                }}
                        />
                </Layout>
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
