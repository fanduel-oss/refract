import * as fromObs from 'callbag-from-obs'
import * as toObs from 'callbag-to-obs'
import { Callbag } from 'callbag'

export interface Listener<T> {
    next: (val: T) => void
    error: (err: any) => void
    complete: (val?: T) => void
}

export interface Subscription {
    unsubscribe(): void
}

export interface ObservableComponent {
    observe: <T = any>(propName: string) => Callbag
    mount: Callbag
    unmount: Callbag
}

export type EffectFactory<P, E> = (
    props: P
) => (component: ObservableComponent) => Callbag

export const subscribeToSink = <T>(
    sink: Callbag,
    next: (val: T) => void
): Subscription =>
    toObs(sink).subscribe({
        next
    })

export const createObservable = <T>(subscribe): Callbag => {
    const observable = {
        subscribe(listener: Listener<T>) {
            const unsubscribe = subscribe(listener)

            return { unsubscribe }
        }
    }

    return fromObs(observable)
}
