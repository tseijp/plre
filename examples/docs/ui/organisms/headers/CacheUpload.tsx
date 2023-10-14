import * as React from 'react'
import { UploadIcon } from '../../atoms'
import { Button } from '../../atoms/Button'

export const CacheUpload = () => {
        return (
                <Button padding="0 6px 0 3px" gap="3px">
                        <UploadIcon />
                        Upload
                </Button>
        )
}
