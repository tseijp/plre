const { sign } = Math

export const xyDir = (x: number, y: number) => {
        return x ** 2 > y ** 2 ? (sign(x) > 0 ? 1 : 3) : sign(y) > 0 ? 2 : 0
}

export const isSplit = (dir = 0, j = 0) => {
        if (j === 0) return dir === 1 || dir === 2
        if (j === 1) return dir === 2 || dir === 3
        if (j === 2) return dir === 3 || dir === 0
        if (j === 3) return dir === 0 || dir === 1
}

export const isShrink = (dir: number, i: number, j: number, row: boolean) => {
        if (row) {
                if (i % 2) {
                        return (j === 0 || j === 3) && dir === 3
                } else return (j === 1 || j === 2) && dir === 1
        } else {
                if (i % 2) {
                        return (j === 0 || j === 1) && dir === 0
                } else return (j === 2 || j === 3) && dir === 2
        }
}

export const isReverseShrink = (
        dir: number,
        i: number,
        j: number,
        row: boolean
) => {
        if (row) {
                if (i % 2) {
                        return (j === 0 || j === 3) && dir === 1
                } else return (j === 1 || j === 2) && dir === 3
        } else {
                if (i % 2) {
                        return (j === 0 || j === 1) && dir === 2
                } else return (j === 2 || j === 3) && dir === 0
        }
}

export const isCancelShrink = (
        x: number,
        y: number,
        i: number,
        j: number,
        row: boolean
) => {
        if (row) {
                if (i % 2) {
                        if (j === 0) return y < 0 // dir === 0
                        if (j === 3) return y > 0 // dir === 2
                } else {
                        if (j === 1) return y < 0 // dir === 0
                        if (j === 2) return y > 0 // dir === 2
                }
        } else {
                if (i % 2) {
                        if (j === 1) return x > 0 // dir === 1
                        if (j === 0) return x < 0 // dir === 3
                } else {
                        if (j === 2) return x > 0 // dir === 1
                        if (j === 4) return x < 0 // dir === 3
                }
        }
}

export const cursor = (sign: number, row = false) => {
        if (row) {
                if (sign === 1) {
                        return 'e-resize'
                } else return 'w-resize'
        } else {
                if (sign === 1) {
                        return 's-resize'
                } else return 'n-resize'
        }
}
