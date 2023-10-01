/**
 * ref: https://lygia.xyz/resolve.js
 */
export function getFile(url: string) {
        let httpRequest = new XMLHttpRequest()
        httpRequest.open('GET', url, false)
        httpRequest.send()
        if (httpRequest.status === 200) return httpRequest.responseText
        else return ''
}

// eslint-disable-next-line
const REG = /\"|\;|\s/g

export function resolveLygia(lines: string | string[]) {
        if (!Array.isArray(lines)) {
                lines = lines.split(/\r?\n/)
        }

        let src = ''

        lines.forEach((line) => {
                const line_trim = line.trim()
                if (line_trim.startsWith('#include "lygia')) {
                        let url = line_trim.substring(15)
                        url = 'https://lygia.xyz' + url.replace(REG, '')
                        src += getFile(url) + '\n'
                } else {
                        src += line + '\n'
                }
        })

        return src
}

export async function resolveLygiaAsync(lines: string | string[]) {
        if (!Array.isArray(lines)) lines = lines.split(/\r?\n/)

        const response = await Promise.all(
                lines.map(async (line) => {
                        const line_trim = line.trim()
                        if (line_trim.startsWith('#include "lygia')) {
                                let url = line_trim.substring(15)
                                url = 'https://lygia.xyz' + url.replace(REG, '')
                                return fetch(url).then((res) => res.text())
                        } else return line
                })
        )

        return response.join('\n')
}

/**
 * my created
 */
const cache = new Map<string, Promise<string>>()

export async function resolve(lines: string | string[]) {
        const set = new Set<string>()

        if (!Array.isArray(lines)) lines = lines.split(/\r?\n/)

        const response = await Promise.all(
                lines.map(async (line) => {
                        const line_trim = line.trim()
                        if (line_trim.startsWith('#include "lygia')) {
                                let url = line_trim.substring(15)
                                url = 'https://lygia.xyz' + url.replace(REG, '')

                                // once only
                                if (set.has(url)) return
                                set.add(url)

                                // cache hit
                                if (cache.has(url)) return cache.get(url)
                                // if (localStorage.getItem(url)) return localStorage.getItem(url)

                                return fetch(url).then((res) => {
                                        const text = res.text()
                                        cache.set(url, text)
                                        // localStorage.setItem(url, text + "")
                                        return text
                                })
                        } else return line
                })
        )

        return response.join('\n')
}
