import $$observable from 'symbol-observable'
import { Callbag, Source, Sink } from 'callbag'
const fromObs = require('callbag-from-obs')
const toObs = require('callbag-to-obs')
const dropRepeats = require('callbag-drop-repeats')
const map = require('callbag-map')
const pipe = require('callbag-pipe')
const filter = require('callbag-filter')
import startWith from 'callbag-start-with'

import { PushEvent } from './baseTypes'
import {
    isEvent,
    MOUNT_EVENT,
    UNMOUNT_EVENT,
    isProps,
    isCallback,
    Data,
    PropsData,
    EventData,
    CallbackData,
    shallowEquals
} from './data'

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
        propName?: string,
        valueTransformer?: (value: any) => T
    ) => Source<T>
    fromEvent: <T>(
        eventName: string,
        valueTransformer?: (val: any) => T
    ) => Source<T>
    mount: Source<any>
    unmount: Source<any>
    pushEvent: PushEvent
    useEvent: <T>(eventName: string) => [Source<T>, (val: T) => any]
}

export type Aperture<P, E, C = any> = (
    initialProps: P,
    initialContext: C
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

export const createComponent = <P>(
    instance,
    dataObservable,
    pushEvent: PushEvent
): ObservableComponent => {
    const data = () => fromObs(dataObservable) as Source<Data<P>>
    const fromEvent = <T>(eventName, valueTransformer?) =>
        pipe(
            data(),
            filter(isEvent(eventName)),
            map((data: EventData) => {
                const { value } = data.payload

                return valueTransformer ? valueTransformer(value) : value
            })
        )

    return {
        mount: pipe(data(), filter(isEvent(MOUNT_EVENT)), map(() => undefined)),
        unmount: pipe(
            data(),
            filter(isEvent(UNMOUNT_EVENT)),
            map(() => undefined)
        ),
        observe: <T>(propName?, valueTransformer?) => {
            if (propName && typeof instance.props[propName] === 'function') {
                return pipe(
                    data(),
                    filter(isCallback(propName)),
                    map((data: CallbackData) => {
                        const { args } = data.payload

                        return valueTransformer
                            ? valueTransformer(args)
                            : args[0]
                    })
                )
            }

            if (propName) {
                return pipe(
                    data(),
                    filter(isProps),
                    map((data: PropsData<P>) => {
                        const prop = data.payload[propName]

                        return valueTransformer ? valueTransformer(prop) : prop
                    }),
                    dropRepeats()
                )
            }

            return pipe(
                data(),
                filter(isProps),
                map((data: PropsData<P>) => data.payload),
                dropRepeats(shallowEquals)
            )
        },
        fromEvent,
        pushEvent,
        useEvent: <T>(eventName: string, seedValue?: T) => {
            const events$ = fromEvent(eventName)
            const pushEventValue = pushEvent(eventName) as (value: T) => void

            return [
                seedValue === undefined
                    ? events$
                    : pipe(events$, startWith(seedValue)),
                pushEventValue
            ]
        }
    }
}
