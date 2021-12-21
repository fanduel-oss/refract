import $$observable from 'symbol-observable'
import { Source, Sink } from 'callbag'
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

export interface Listener<Type> {
    next: (val: Type) => void
    error: (err: any) => void
    complete: (val?: Type) => void
}

export interface Subscription {
    unsubscribe(): void
}

export interface UseEvent {
    (eventName: string): [Source<void>, () => any]
    <Type = any>(eventName: string, seedValue?: Type): [
        Source<Type>,
        (val: Type) => any
    ]
}

export interface FromEvent {
    (eventName: string): Source<void>
    <Type>(eventName: string, valueTransformer?: (val: any) => Type): Source<
        Type
    >
}

export interface ObservableComponentBase {
    mount: Source<any>
    unmount: Source<any>
    fromEvent: FromEvent
    pushEvent: PushEvent
    useEvent: UseEvent
}

export interface Observe {
    observe: <Type>(
        propName?: string,
        valueTransformer?: (val: any) => Type
    ) => Source<Type>
}

export type ObservableComponent = Observe & ObservableComponentBase

export type Aperture<Props, Effect, Context = any> = (
    component: ObservableComponent,
    initialProps: Props,
    initialContext?: Context
) => Sink<Effect>

export const subscribeToSink = <Type>(
    sink: Sink<Type>,
    next: (val: Type) => void,
    error?: (error: any) => void
): Subscription =>
    toObs(sink).subscribe({
        next,
        error
    })

const getComponentBase = (
    data: Source<any>,
    pushEvent: PushEvent
): ObservableComponentBase => {
    const fromEvent = (eventName, valueTransformer?) =>
        pipe(
            data,
            filter(isEvent(eventName)),
            map((data: EventData) => {
                const { value } = data.payload

                return valueTransformer ? valueTransformer(value) : value
            })
        )

    function useEvent(eventName: string, seedValue?: any) {
        const hasSeedValue = arguments.length > 1
        const events$ = fromEvent(eventName)
        const pushEventValue = pushEvent(eventName)

        return [
            !hasSeedValue ? events$ : pipe(events$, startWith(seedValue)),
            pushEventValue
        ]
    }

    return {
        mount: pipe(data, filter(isEvent(MOUNT_EVENT)), map(() => undefined)),
        unmount: pipe(
            data,
            filter(isEvent(UNMOUNT_EVENT)),
            map(() => undefined)
        ),
        fromEvent,
        pushEvent,
        useEvent: useEvent as UseEvent
    }
}

export const getObserve = <Props>(getProp, data, decoratedProps) => {
    return function observe<Type>(propName?, valueTransformer?) {
        if (
            decoratedProps &&
            propName &&
            typeof getProp(propName) === 'function'
        ) {
            return pipe(
                data(),
                filter(isCallback(propName)),
                map((data: CallbackData) => {
                    const { args } = data.payload

                    return valueTransformer ? valueTransformer(args) : args[0]
                })
            )
        }

        if (propName) {
            return pipe(
                data(),
                filter(isProps),
                map((data: PropsData<Props>) => {
                    const prop = data.payload[propName]

                    return valueTransformer ? valueTransformer(prop) : prop
                }),
                dropRepeats()
            )
        }

        return pipe(
            data(),
            filter(isProps),
            map((data: PropsData<Props>) => data.payload),
            dropRepeats(shallowEquals)
        )
    }
}

export const createComponent = <Props>(
    getProp,
    dataObservable,
    pushEvent: PushEvent,
    decoratedProps: boolean
): ObservableComponent => {
    const data = () => fromObs(dataObservable) as Source<Data<Props>>

    return {
        observe: getObserve(getProp, data, decoratedProps),
        ...getComponentBase(data(), pushEvent)
    }
}

export const createObservable = subscribe => ({
    subscribe,
    [$$observable]() {
        return this
    }
})
