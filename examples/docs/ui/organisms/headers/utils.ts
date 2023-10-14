import { CacheState, byteSize } from 'plre/cache'

export const createURL = () => {
        const url = new URL(window.location.href)
        const params = new URLSearchParams(url.search)
        const toString = () => {
                url.search = params.toString()
                return url.toString()
        }
        return {
                url,
                params,
                toString,
                get(key = '') {
                        return params.get(key)
                },
                set(key = '', value = '') {
                        return params.set(key, value)
                },
                replaceState() {
                        window.history.replaceState(null, '', toString())
                },
        }
}

export const makeYMD = (date = new Date()) => {
        const Y = date.getFullYear()
        const M = String(date.getMonth() + 1).padStart(2, '0')
        const D = String(date.getDate()).padStart(2, '0')
        return `${Y}-${M}-${D}`
}
export const makeHMS = (date = new Date()) => {
        const h = String(date.getHours()).padStart(2, '0')
        const m = String(date.getMinutes()).padStart(2, '0')
        return `${h}:${m}`
}

export const makeId = () => {
        return createURL().get('id')
}

export const makeFileName = () => {
        const date = new Date()
        const YMD = makeYMD(date)
        const id = makeId()
        return ['PLRE', YMD, id].join('_') + '.json'
}

export const makeRecentName = (cache: CacheState) => {
        const date = new Date(cache.updatedAt)
        const YMD = makeYMD(date)
        const HMS = makeHMS(date)
        const id = cache.id
        return [YMD, HMS].join(' ')
}
