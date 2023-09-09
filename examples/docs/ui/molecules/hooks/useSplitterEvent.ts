import { useCall, useDragEvent } from '../../atoms'

export const useSplitEvent = (on = () => {}) => {
        const call = useCall(on)
        const drag = useDragEvent(call)
        return drag
}
