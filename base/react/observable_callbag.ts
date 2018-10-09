import $$observable from 'symbol-observable'
import { Callbag, Source, Sink } from 'callbag'
const fromObs = require('callbag-from-obs')
const toObs = require('callbag-to-obs')
const dropRepeats = require('callbag-drop-repeats')
const map = require('callbag-map')
const pipe = require('callbag-pipe')
const filter = require('callbag-filter')

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
    event: <T>(
        eventName: string,
        valueTransformer?: (val: any) => T
    ) => Source<T>
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

export const createComponent = <P>(
    instance,
    dataObservable,
    pushEvent
): ObservableComponent => {
    const data = fromObs(dataObservable) as Source<Data<P>>

    return {
        mount: pipe(data, filter(isEvent(MOUNT_EVENT)), map(() => undefined)),
        unmount: pipe(
            data,
            filter(isEvent(UNMOUNT_EVENT)),
            map(() => undefined)
        ),
        observe: <T>(propName?, valueTransformer?) => {
            if (propName && typeof instance.props[propName] === 'function') {
                return pipe(
                    data,
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
                    data,
                    filter(isProps),
                    map((data: PropsData<P>) => {
                        const prop = data.payload[propName]

                        return valueTransformer ? valueTransformer(prop) : prop
                    }),
                    dropRepeats()
                )
            }

            return pipe(
                data,
                filter(isProps),
                map((data: PropsData<P>) => data.payload),
                dropRepeats(shallowEquals)
            )
        },
        event: <T>(eventName, valueTransformer?) =>
            pipe(
                data,
                filter(isEvent(eventName)),
                map((data: EventData) => {
                    const { value } = data.payload

                    return valueTransformer ? valueTransformer(value) : value
                })
            ),
        pushEvent
    }
}
