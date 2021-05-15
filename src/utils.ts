export function findThenPop<T>(
    array: T[],
    matcher: (v: T) => boolean
): T | undefined {
    const index = array.findIndex(matcher)
    if (index === -1) {
        return undefined
    }

    const foundItem = array[index]

    array.splice(index, 1)

    return foundItem
}
