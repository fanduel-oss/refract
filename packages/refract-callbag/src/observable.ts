import $$observable from 'symbol-observable'
const fromObs = require('callbag-from-obs')
const toObs = require('callbag-to-obs')
import { ObserveOptions } from './baseTypes'

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
    observe: <T = any>(
        propName: string,
        options?: Partial<ObserveOptions>
    ) => Source<T>
    mount: Source<any>
    unmount: Source<any>
}

export type Aperture<P, E> = (
    props: P
) => (component: ObservableComponent) => Sink<E>

export const subscribeToSink = <T>(
    sink: Sink<T>,
    next: (val: T) => void,
    error?: (error: any) => void
): Subscription =>
    toObs(sink).subscribe({
        next,
        error
    })

export const createObservable = <T>(subscribe): Source<T> => {
    const observable = {
        subscribe(listener: Listener<T>) {
            const unsubscribe = subscribe(listener)

            return { unsubscribe }
        },
        [$$observable]() {
            return this
        }
    }

    return fromObs(observable)
}
