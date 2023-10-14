import * as React from 'react'

import { Button } from '../../atoms/Button'

export const OpenNewTab = () => {
        const [ws, set] = React.useState([])
        const handleOpen = () => {
                const params = new URLSearchParams(window.location.search)
                const roomId = params.get('roomId') || '0'
                const url = `${window.location.origin}/?roomId=${roomId}`
                const w = window.open(url, '_blank')
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
