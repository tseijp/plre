import * as React from 'react'
import { Box, Field, Flex } from '../atoms'
import { Header, UserProfile, UserProfiles } from '../molecules'
import type { EditorState } from 'plre/types'

export interface TimelineProps {
        editorItem: EditorState
}

export const Timeline = (props: TimelineProps) => {
        const { editorItem } = props
        return (
                <Flex backgroundColor="#303030">
                        <Header editorItem={editorItem} />
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
