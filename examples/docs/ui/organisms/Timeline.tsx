import * as React from 'react'
import { Box, Flex } from '../atoms'
import { Header } from './headers/Header'
import { UserProfile, UserProfiles } from './users'
import type { EditorState } from 'plre/types'

export interface TimelineProps {
        editorItem: EditorState
}

export const Timeline = (props: TimelineProps) => {
        const [ws, set] = React.useState([])
        const { editorItem } = props
        const handleOpen = () => {
                const params = new URLSearchParams(window.location.search)

                const roomId = params.get('roomId') || '0'
                const url = `http://localhost:3000/?roomId=${roomId}`
                const w = window.open(url, '_blank')
                w.focus()
                set((p) => [...p, w])
        }
        return (
                <Flex backgroundColor="#303030">
                        <Header editorItem={editorItem}>
                                <div
                                        onClick={handleOpen}
                                        style={{
                                                cursor: 'pointer',
                                                height: '20px',
                                                fontSize: 12,
                                                lineHeight: '18px',
                                                userSelect: 'none',
                                                border: '1px solid #696969',
                                                background: '#535353',
                                                borderRadius: '4px',
                                        }}
                                >
                                        Open
                                </div>
                                <div
                                        onClick={() => {
                                                ws.forEach((w) => {
                                                        w.close()
                                                })
                                                set([])
                                        }}
                                        style={{
                                                cursor: 'pointer',
                                                height: '20px',
                                                fontSize: 12,
                                                lineHeight: '18px',
                                                userSelect: 'none',
                                                border: '1px solid #696969',
                                                background: '#535353',
                                                borderRadius: '4px',
                                                display:
                                                        ws.length > 0
                                                                ? ''
                                                                : 'none',
                                        }}
                                >
                                        Close
                                        {ws.length > 1 ? ' ' + ws.length : ''}
                                </div>
                        </Header>
                        <Flex
                                gap="1rem"
                                overflow="scroll"
                                padding="1rem"
                                justifyContent="start"
                                alignItems="start"
                                backgroundColor="#3A3A3A"
                        >
                                <Box grow={-1} fontSize="1.5rem" height="3rem">
                                        Your Profile
                                </Box>
                                <UserProfile />
                                <Box grow={-1} fontSize="1.5rem" height="3rem">
                                        Other Profiles
                                </Box>
                                <UserProfiles />
                        </Flex>
                </Flex>
        )
}
