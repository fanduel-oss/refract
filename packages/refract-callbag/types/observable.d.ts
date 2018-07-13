import { ObserveOptions } from './baseTypes'
export interface Callbag<I, O> {
    (t: 0, d: Callbag<O, I>): void
    (t: 1, d: I): void
    (t: 2, d?: any): void
}
export declare type Source<T> = Callbag<void, T>
export declare type Sink<T> = Callbag<T, void>
export interface Listener<T> {
    next: (val: T) => void
    error: (err: any) => void
    complete: (val?: T) => void
}
export interface Subscription {
    unsubscribe(): void
}
export interface ObservableComponent {
    observe: <T = any>(
        propName: string,
        options?: Partial<ObserveOptions>
    ) => Source<T>
    mount: Source<any>
    unmount: Source<any>
}
export declare type Aperture<P, E> = (
    props: P
) => (component: ObservableComponent) => Sink<E>
export declare const subscribeToSink: <T>(
    sink: Callbag<T, void>,
    next: (val: T) => void,
    error?: (error: any) => void
) => Subscription
export declare const createObservable: <T>(subscribe: any) => Callbag<void, T>
