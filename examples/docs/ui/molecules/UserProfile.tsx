import React, { useEffect } from 'react'
import { Box, Field, Flex, useCall } from '../atoms'
import { useFieldEvent } from '.'
import { useCtx } from '../ctx'

export const UserProfile = () => {
        const { webrtcTree } = useCtx()
        const handleChangeUsername = useCall((value: string) => {
                webrtcTree.user.set('username', value)
        })
        const handleChangeProfile = useCall((value: string) => {
                webrtcTree.user.set('profile', value)
        })
        return (
                <Profile
                        isSelf
                        online
                        userId={webrtcTree.userId}
                        username={webrtcTree.username}
                        onChangeUsername={handleChangeUsername}
                        onChangeProfile={handleChangeProfile}
                />
        )
}

export interface ProfileProps {
        userId?: string
        username?: string
        profile?: string
        isSelf?: boolean
        online?: boolean
        onChangeUsername?(value: string): void
        onChangeProfile?(value: string): void
}

export const Profile = (props: ProfileProps) => {
        const {
                userId,
                username,
                profile,
                isSelf,
                online,
                onChangeUsername = () => {},
                onChangeProfile = () => {},
        } = props

        const changeHeight = useCall(() => {
                const el = profileState.target
                if (!el) return
                el.style.height = '5px'
                el.style.height = el.scrollHeight + 'px'
        })

        const usernameState = useFieldEvent(() => {
                const { value } = usernameState
                onChangeUsername(value)
        })

        const profileState = useFieldEvent(() => {
                const { value } = profileState
                changeHeight()
                onChangeProfile(value)
        })

        useEffect(() => changeHeight(), [profile])

        return (
                <Flex
                        row
                        gap="1rem"
                        height="auto"
                        alignItems="start"
                        flexShrink={0}
                >
                        <Box
                                position="relative"
                                width="40px"
                                height="40px"
                                shrink={0}
                                marginTop="6px"
                                borderRadius={9999}
                                textAlign="center"
                                lineHeight="40px"
                                fontSize="30px"
                                color="white"
                                overflow="visible"
                                backgroundColor="#212121"
                        >
                                {userId[0].toUpperCase()}
                                {/* online marker */}
                                {/* <Box
                                        position="absolute"
                                        bottom={0}
                                        right={0}
                                        width="10px"
                                        height="10px"
                                        borderRadius={9999}
                                        backgroundColor={
                                                online ? 'green' : 'gray'
                                        }
                                        transform="translate(50%, 50%)"
                                /> */}
                                <div
                                        style={{
                                                position: 'absolute',
                                                bottom: 1,
                                                right: 1,
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '9999px',
                                                backgroundColor: online
                                                        ? 'lightgreen'
                                                        : 'gray',
                                        }}
                                />
                        </Box>
                        <Box>
                                <Flex>
                                        <Field
                                                height="2rem"
                                                minWidth="100%"
                                                ref={usernameState.ref as any}
                                                value={username}
                                                placeholder={
                                                        isSelf
                                                                ? 'Type name here...'
                                                                : ''
                                                }
                                        />
                                        <Field
                                                as="textarea"
                                                minWidth="100%"
                                                overflow="scroll"
                                                minHeight="3rem"
                                                placeholder={
                                                        isSelf
                                                                ? 'Type profile here...'
                                                                : ''
                                                }
                                                ref={profileState.ref as any}
                                                value={profile}
                                        />
                                </Flex>
                        </Box>
                </Flex>
        )
}
