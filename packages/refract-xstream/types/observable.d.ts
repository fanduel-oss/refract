import xs, { Stream, Listener, Subscription } from 'xstream'
export { Listener, Subscription }
export interface ObservableComponent {
    observe: <T>(propName: string) => Stream<T>
    event: <T>(eventName: string) => Stream<T>
    mount: Stream<any>
    unmount: Stream<any>
}
export declare type Aperture<P, E> = (
    props: P
) => (component: ObservableComponent) => Stream<E>
export declare const subscribeToSink: <T>(
    sink: xs<T>,
    next: (val: T) => void,
    error?: (error: any) => void
) => Subscription
export declare const createObservable: <T>(subscribe: any) => xs<T>
