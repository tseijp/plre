import * as React from 'react'

import { Button } from '../../atoms/Button'
import { createURL } from './utils'

export const OpenNewTab = () => {
        const [ws, set] = React.useState([])

        const handleOpen = () => {
                const url = createURL()
                const w = window.open(url + '', '_blank')
                w.focus()
                set((p) => [...p, w])
        }

        return (
                <>
                        <Button
                                fontSize="16px"
                                padding="0 3px"
                                onClick={handleOpen}
                        >
                                Open New Tab
                        </Button>
                        <Button
                                fontSize="16px"
                                padding="0 2px"
                                display={ws.length > 0 ? '' : 'none'}
                                onClick={() => {
                                        ws.forEach((w) => {
                                                w.close()
                                        })
                                        set([])
                                }}
                        >
                                Close new window
                                {ws.length > 1 ? ' ' + ws.length : ''}
                        </Button>
                </>
        )
}
