import * as React from 'react'
import { Box, Flex } from '../atoms'
import { Header } from './headers/Header'
import { UserProfile, UserProfiles } from './users'
import type { EditorState } from 'plre/types'
import { Button } from '../atoms/Button'

export interface TimelineProps {
        editorItem: EditorState
}

export const Timeline = (props: TimelineProps) => {
        const [ws, set] = React.useState([])
        const { editorItem } = props
        const handleOpen = () => {
                const params = new URLSearchParams(window.location.search)

                const roomId = params.get('roomId') || '0'
                const url = `${window.location.origin}/?roomId=${roomId}`
                const w = window.open(url, '_blank')
                w.focus()
                set((p) => [...p, w])
        }
        return (
                <Flex backgroundColor="#303030">
                        <Header editorItem={editorItem}>
                                <Button
                                        fontSize="16px"
                                        padding="0 2px"
                                        onClick={handleOpen}
                                >
                                        Open
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
                                        Close
                                        {ws.length > 1 ? ' ' + ws.length : ''}
                                </Button>
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
