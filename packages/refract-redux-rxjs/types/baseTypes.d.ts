export interface EnhancerOptions {
    eventsPrefix: string
}
export declare type ActionListener = (action: object) => void
export declare type UnsubscribeFn = () => void
export declare type AddActionListener = (
    actionType: string,
    listener: ActionListener
) => UnsubscribeFn
export declare type Selector<T> = (state: object) => T
export interface ObserveOptions {
    initialValue: boolean
}
