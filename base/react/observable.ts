import { Observable, PartialObserver as Listener, Subscription } from 'rxjs'
import { ObserveOptions } from './baseTypes'

export { Listener, Subscription }

export interface ObservableComponent {
    observe: <T>(
        propName: string,
        options?: Partial<ObserveOptions>
    ) => Observable<T>
    mount: Observable<any>
    unmount: Observable<any>
}

export type Aperture<P, E> = (
    initialProps: P
) => (component: ObservableComponent) => Observable<E>

export const subscribeToSink = <T>(
    sink: Observable<T>,
    next: (val: T) => void,
    error?: (error: any) => void
): Subscription =>
    sink.subscribe({
        next,
        error
    })

export const createObservable = <T>(subscribe): Observable<T> =>
    Observable.create((Listener: Partial<Listener<T>>) => {
        const unsubscribe = subscribe(Listener)

        return unsubscribe
    })
