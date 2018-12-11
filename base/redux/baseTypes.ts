export interface EnhancerOptions {
    eventsPrefix: string
}
export type ActionListener = (action: object) => void
export type UnsubscribeFn = () => void
export type AddActionListener = (
    actionType: string,
    listener: ActionListener
) => UnsubscribeFn
export type Selector<T> = (state: object) => T

export const createObservable = subscribe => {
    const observable = {
        subscribe,
        ['@@observable']() {
            return this
        }
    }

    // @ts-ignore
    if (typeof Symbol === 'function' && Symbol.observable) {
        // @ts-ignore
        observable[Symbol.observable] = () => observable
    }

    return observable
}
