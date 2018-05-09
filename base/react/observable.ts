import {
    Observable,
    Observer,
    PartialObserver as Listener,
    Subscription
} from 'rxjs'

export { Listener, Subscription }

export interface ObservableComponent {
    observe: <T>(propName: string) => Observable<T>
    mount: Observable<any>
    unmount: Observable<any>
}

export type EffectFactory<P, E> = (
    props: P
) => (component: ObservableComponent) => Observable<E>

export const subscribeToSink = <T>(
    sink: Observable<T>,
    next: (val: T) => void
): Subscription =>
    sink.subscribe({
        next
    })

export const createObservable = <T>(subscribe): Observable<T> =>
    Observable.create((Listener: Partial<Listener<T>>) => {
        const unsubscribe = subscribe(Listener)

        return unsubscribe
    })
