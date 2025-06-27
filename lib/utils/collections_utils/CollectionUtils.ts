export class CollectionsUtils {
    static async mapAsync<T, R>(records: T[], mapFunc: (record: T) => Promise<R>): Promise<R[]> {
        return Promise.all(records.map(record => mapFunc(record)))
    }

    static async findAsync<T>(collection: T[], predicate: (element: T) => Promise<boolean>): Promise<T | undefined> {
        const results = await Promise.all(collection.map(async element => 
            predicate(element).then(result => ({ element, result }))
        ))

        const found = results.find(element => element.result)
        return found?.element
    }

    static async filterAsync<T>(collection: T[], predicate: (element: T) => Promise<boolean>): Promise<T[]> {
        const results = await Promise.all(collection.map(async element => {
            return {
                element,
                result: await predicate(element),
            }
        }))

        return results.filter(element => element.result).map(element => element.element)
    }
}