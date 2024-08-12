export async function withServerMemo<T>(namespace: string, key: string, or: () => Promise<T>) {
    if (!map[namespace])
        map[namespace] = {}

    if (map[namespace][key])
        return map[namespace][key]

    map[namespace][key] = await or()
    return map[namespace][key]
}


var map: {[key: string]: {[key:string]: any}} = {

}