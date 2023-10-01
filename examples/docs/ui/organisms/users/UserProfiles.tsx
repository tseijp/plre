import React, { useState } from 'react'
import { useForceUpdate, useOnce } from '../../atoms'
import { useCtx } from '../../ctx'
import { Profile } from './UserProfile'
import { useUserObserve } from '..//hooks'
import type { ProfileProps } from './UserProfile'

export const UserProfileImpl = (props: ProfileProps) => {
        const { userId } = props
        const [online, setOnline] = useState(false)
        const [profile, setProfile] = useState('')
        const [username, setUsername] = useState('anonymous')

        const ymap = useUserObserve(userId, {
                onUpdate(key) {
                        const value = ymap.get(key)
                        if (key === 'username') setUsername(value)
                        if (key === 'profile') setProfile(value)
                },
                onActive() {
                        setOnline(true)
                },
                onDeactive() {
                        setOnline(false)
                },
        })

        return (
                <Profile
                        userId={userId}
                        online={online}
                        username={username}
                        profile={profile}
                />
        )
}

export const UserProfiles = () => {
        const forceUpdate = useForceUpdate()
        const { webrtcTree } = useCtx()
        useOnce(() => {
                // @ts-ignore
                webrtcTree('updateUsers', forceUpdate)
                return true
        })
        return webrtcTree._users.map((key) => (
                <UserProfileImpl key={key} userId={key} />
        ))
}
