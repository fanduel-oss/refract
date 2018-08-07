import { Callbag, Source, Sink } from 'callbag'
export interface Listener<T> {
    next: (val: T) => void
    error: (err: any) => void
    complete: (val?: T) => void
}
export interface Subscription {
    unsubscribe(): void
}
export interface ObservableComponent {
    observe: <T = any>(propName: string) => Source<T>
    event: <T>(eventName: string) => Source<T>
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
