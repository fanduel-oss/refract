import { Stream, Subscriber as Listener } from 'most'
export { Listener }
export interface ObservableComponent {
    observe: <T>(propName: string) => Stream<T>
    event: <T>(eventName: string) => Stream<T>
    mount: Stream<any>
    unmount: Stream<any>
}
export interface Subscription {
    unsubscribe(): void
}
export declare type Aperture<P, E> = (
    props: P
) => (component: ObservableComponent) => Stream<E>
export declare const subscribeToSink: <T>(
    sink: Stream<T>,
    next: (val: T) => void,
    error?: (error: any) => void
) => Subscription
export declare const createObservable: <T>(subscribe: any) => Stream<T>
