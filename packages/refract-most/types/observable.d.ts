import { Stream, Subscriber as Listener } from 'most'
import { ObserveOptions } from './baseTypes'
export { Listener }
export interface ObservableComponent {
    observe: <T>(
        propName: string,
        options: Partial<ObserveOptions>
    ) => Stream<T>
    mount: Stream<any>
    unmount: Stream<any>
}
export interface Subscription {
    unsubscribe(): void
}
export declare type EffectFactory<P, E> = (
    props: P
) => (component: ObservableComponent) => Stream<E>
export declare const subscribeToSink: <T>(
    sink: Stream<T>,
    next: (val: T) => void,
    error?: (error: any) => void
) => Subscription
export declare const createObservable: <T>(subscribe: any) => Stream<T>
