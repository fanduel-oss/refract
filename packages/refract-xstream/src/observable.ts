import xs, { Stream, Listener, Subscription } from 'xstream'

export { Listener, Subscription }

export interface ObservableComponent {
    observe: <T>(propName: string) => Stream<T>
    mount: Stream<any>
    unmount: Stream<any>
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
    let unsubscribe

    return xs.create({
        start(listener: Partial<Listener<T>>) {
            unsubscribe = subscribe(listener)
        },

        stop() {
            unsubscribe()
        }
    })
}
