import $$observable from 'symbol-observable'
import { Callbag, Source, Sink } from 'callbag'
const fromObs = require('callbag-from-obs')
const toObs = require('callbag-to-obs')
import { PushEvent } from './baseTypes'

export interface Listener<T> {
    next: (val: T) => void
    error: (err: any) => void
    complete: (val?: T) => void
}

export interface Subscription {
    unsubscribe(): void
}

export interface ObservableComponent {
    observe: <T = any>(propName?: string) => Source<T>
    fromEvent: <T>(eventName: string) => Source<T>
    mount: Source<any>
    unmount: Source<any>
    pushEvent: PushEvent
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
