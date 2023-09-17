import { useForceUpdate, useOnce } from '../../atoms'
import { createEditor } from 'plre'

export const createPLEditor = (update = () => {}) => {
        const viewport = createEditor('viewlayer')
        // const viewport = createEditor('viewport')
        const timeline = createEditor('timeline')
        // return createEditor(
        //         'I',
        //         { top: true, row: true, rate: [0.5, 0.5], update },
        //         [viewport, timeline]
        // )
        const viewlayer = createEditor('viewlayer')
        const properties = createEditor('properties')
        const left = createEditor('I', { rate: [0.92, 0.08] }, [
                viewport,
                timeline,
        ])
        const right = createEditor('I', { rate: [0.33, 0.67] }, [
                viewlayer,
                properties,
        ])
        const top = createEditor(
                'I',
                { rate: [0.83, 0.17], row: true, top: true, update },
                [left, right]
        )
        return top
}

export const useInitPLEditor = () => {
        const update = useForceUpdate()
        return useOnce(() => createPLEditor(update))
}
