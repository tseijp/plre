import * as React from 'react'
import Layout from '@theme/Layout'
import {
        ShowcaseBody,
        ShowcaseCard,
        ShowcaseCardProps,
        ShowcaseHead,
} from '../../ui/organisms'

// prettier-ignore
const showcases: ShowcaseCardProps[] = [
        { head: '1', more: '', json: '/json/PLRE_2023-11-01_1.json' },
        { head: '2', more: '', json: '/json/PLRE_2023-11-01_2.json' },
        { head: '3', more: '', json: '/json/PLRE_2023-11-01_3.json' },
        { head: '1', more: '', json: '/json/PLRE_2023-11-01_1.json' },
        { head: '2', more: '', json: '/json/PLRE_2023-11-01_2.json' },
        { head: '3', more: '', json: '/json/PLRE_2023-11-01_3.json' },
        { head: '1', more: '', json: '/json/PLRE_2023-11-01_1.json' },
        { head: '2', more: '', json: '/json/PLRE_2023-11-01_2.json' },
        { head: '3', more: '', json: '/json/PLRE_2023-11-01_3.json' },
]

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
