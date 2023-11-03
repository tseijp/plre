import * as React from 'react'
import { Button, Flex } from '../../atoms'

export const ShowcaseHead = () => {
        const handleClick = () => {
                window.open('https://github.com/tseijp/plre/discussions/10')
        }

        return (
                <Flex marginTop="5rem" gap="1.5rem">
                        <h1 style={{ margin: 0 }}>plre works showcase</h1>
                        <div>List of works people are creating with plre</div>
                        <Button
                                as="a"
                                padding="0.5rem 1rem"
                                onClick={handleClick}
                        >
                                {'🙇‍♂️ '}Please add your works
                        </Button>
                </Flex>
        )
}
