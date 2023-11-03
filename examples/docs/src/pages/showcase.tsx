import * as React from 'react'
import Layout from '@theme/Layout'
import { ShowcaseBody, ShowcaseCard, ShowcaseHead } from '../../ui/organisms'

// prettier-ignore
const showcases = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]

const Showcase = () => {
        return (
                <Layout>
                        <ShowcaseHead />
                        <ShowcaseBody>
                                {showcases.map((props, key) => (
                                        <ShowcaseCard key={key} {...props} />
                                ))}
                        </ShowcaseBody>
                </Layout>
        )
}

export default Showcase
