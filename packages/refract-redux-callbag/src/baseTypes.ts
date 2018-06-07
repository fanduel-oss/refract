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

export interface ObserveOptions {
    initialValue: boolean
}
