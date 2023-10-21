import * as React from 'react'
import { Button } from '../../atoms/Button'
import { createURL } from './utils'
import { HeaderLink } from '../../molecules'

export const OpenNewTab = () => {
        const [ws, setWs] = React.useState([])
        const handleOpen = () => {
                const url = createURL()
                const w = window.open(url + '', '_blank')
                w.focus()
                setWs((p) => [...p, w])
        }

        return (
                <>
                        <HeaderLink onClick={handleOpen}>
                                Open New Tab
                        </HeaderLink>
                        <Button
                                fontSize="16px"
                                padding="0 2px"
                                display={ws.length > 0 ? '' : 'none'}
                                onClick={() => {
                                        ws.forEach((w) => {
                                                w.close()
                                        })
                                        setWs([])
                                }}
                        >
                                Close new window
                                {ws.length > 1 ? ' ' + ws.length : ''}
                        </Button>
                </>
        )
}
