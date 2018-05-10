import * as fromObs from 'callbag-from-obs'
import * as toObs from 'callbag-to-obs'

export interface Callbag<I, O> {
    (t: 0, d: Callbag<O, I>): void
    (t: 1, d: I): void
    (t: 2, d?: any): void
}

export type Source<T> = Callbag<void, T>
export type Sink<T> = Callbag<T, void>

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
    mount: Source<any>
    unmount: Source<any>
}

export type EffectFactory<P, E> = (
    props: P
) => (component: ObservableComponent) => Sink<E>

export const subscribeToSink = <T>(
    sink: Sink<T>,
    next: (val: T) => void
): Subscription =>
    toObs(sink).subscribe({
        next
    })

export const createObservable = <T>(subscribe): Source<T> => {
    const observable = {
        subscribe(listener: Listener<T>) {
            const unsubscribe = subscribe(listener)

            return { unsubscribe }
        }
    }

    return fromObs(observable)
}
