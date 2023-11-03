import * as React from 'react'
import { useRef, useState } from 'react'
import { decode } from '../../templates/hooks'
import { HeaderStyle } from '..'
import { HeaderButton } from '../../molecules'
import { Button, Drop, Flex } from '../../atoms'
import { ShowcasePort, ShowcasePortDummy } from './ShowcasePort'

export interface ShowcaseCardProps {
        head?: string
        more?: string
        json?: string
}

export const ShowcaseCard = (props: ShowcaseCardProps) => {
        const {
                head = 'Example',
                more = 'lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
                json = '/json/PLRE_2023-11-01_4.json',
        } = props
        const [isReady, set] = useState(false)
        const cache = useRef({ isLoaded: false, res: null, obj: null }).current

        const handleLoad = async () => {
                try {
                        if (cache.isLoaded) return
                        const res = await fetch(json)
                        cache.res = await res.json()
                        cache.obj = decode(cache.res.data)
                        if (cache.obj) set(true)
                } catch (e) {
                        console.warn(e)
                }
        }

        const handleOpen = () => {}

        return (
                <div onMouseEnter={handleLoad}>
                        <Flex
                                color="white"
                                fontSize="16px"
                                borderRadius="6px"
                                backgroundColor="#303030"
                                transformStyle="preserve-3d"
                        >
                                <HeaderStyle>
                                        <Button
                                                padding="0 4px"
                                                onClick={handleOpen}
                                        >
                                                {head}
                                        </Button>
                                        <Drop>
                                                <HeaderButton>
                                                        More
                                                </HeaderButton>
                                                <div>{more}</div>
                                        </Drop>
                                </HeaderStyle>
                                {isReady ? (
                                        <ShowcasePort objectTree={cache.obj} />
                                ) : (
                                        <ShowcasePortDummy />
                                )}
                        </Flex>
                </div>
        )
}
