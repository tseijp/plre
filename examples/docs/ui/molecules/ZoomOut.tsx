import * as React from 'react'
import { WheelState, ZoomOutIcon } from '../atoms'
import { useZoomEvent } from './hooks/useZoomEvent'

export interface ZoomOutProps {
        wheel: WheelState
}

export const ZoomOut = (props: ZoomOutProps) => {
        const { wheel } = props
        const zoom = useZoomEvent(wheel)
        return (
                <div ref={zoom.ref}>
                        <ZoomOutIcon
                                s={25}
                                top="185px"
                                color="white"
                                right="10px"
                                padding="2px"
                                position="absolute"
                                fontSize="2rem"
                                borderRadius={9999}
                                backdropFilter="blur(1px)"
                                // backgroundColor="red"
                                backgroundColor="rgba(42, 42, 42, 0.75)"
                                transform="scale(-1,1)"
                                cursor="pointer"
                        />
                </div>
        )
}
