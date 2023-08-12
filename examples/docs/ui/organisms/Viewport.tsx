import * as React from 'react'
import { usePL } from 'plre/react'
import { Flex } from '../atoms/Flex'
import { useResizeEvent } from '../hooks/useResizeEvent'

export const Viewport = () => {
        const self = usePL({
                render() {
                        self.clear()
                        self.viewport()
                        self.drawArrays()
                },
        })

        const ref = useResizeEvent()

        return (
                <Flex ref={ref}>
                        <canvas ref={self.ref} />
                </Flex>
        )
}
