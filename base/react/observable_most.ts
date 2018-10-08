import { from, Stream, Subscriber as Listener } from 'most'
import $$observable from 'symbol-observable'
import { PushEvent } from './baseTypes'

export { Listener }

export interface ObservableComponent {
    observe: <T>(propName?: string) => Stream<T>
    fromEvent: <T>(eventName: string) => Stream<T>
    mount: Stream<any>
    unmount: Stream<any>
    pushEvent: PushEvent
}

export interface Subscription {
    unsubscribe(): void
}

export type Aperture<P, E> = (
    props: P
) => (component: ObservableComponent) => Stream<E>

export const subscribeToSink = <T>(
    sink: Stream<T>,
    next: (val: T) => void,
    error?: (error: any) => void
): Subscription =>
    sink.subscribe({
        next,
        error,
        complete: () => void 0
    })

export const createObservable = <T>(subscribe): Stream<T> => {
    const observable = {
        subscribe(listener: Listener<T>) {
            const unsubscribe = subscribe(listener)

            return { unsubscribe }
        },
        [$$observable]() {
            return this
        }
    }

    return from(observable)
}
