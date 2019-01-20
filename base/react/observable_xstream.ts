import $$observable from 'symbol-observable'

import xs, { Stream, Listener, Subscription } from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
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

export { Listener, Subscription }

export interface UseEvent {
    (eventName: string): [Stream<void>, () => any]
    <Type = any>(eventName: string, seedValue?: Type): [
        Stream<Type>,
        (val: Type) => any
    ]
}

export interface FromEvent {
    (eventName: string): Stream<void>
    <Type>(eventName: string, valueTransformer?: (val: any) => Type): Stream<
        Type
    >
}

export interface ObservableComponentBase {
    mount: Stream<any>
    unmount: Stream<any>
    fromEvent: FromEvent
    pushEvent: PushEvent
    useEvent: UseEvent
}

export interface Observe {
    observe: <Type>(
        propName?: string,
        valueTransformer?: (val: any) => Type
    ) => Stream<Type>
}

export type ObservableComponent = Observe & ObservableComponentBase

export type Aperture<Props, Effect, Context = any> = (
    component: ObservableComponent,
    initialProps: Props,
    initialContext?: Context
) => Stream<Effect>

export const subscribeToSink = <Type>(
    sink: Stream<Type>,
    next: (val: Type) => void,
    error?: (error: any) => void
): Subscription =>
    sink.subscribe({
        next,
        error,
        complete: () => void 0
    })

const getComponentBase = (
    data: Stream<any>,
    pushEvent: PushEvent
): ObservableComponentBase => {
    const fromEvent = (eventName, valueTransformer?) =>
        data.filter(isEvent(eventName)).map((data: EventData) => {
            const { value } = data.payload

            return valueTransformer ? valueTransformer(value) : value
        })

    function useEvent(eventName: string, seedValue?: any) {
        const hasSeedValue = arguments.length > 1
        const events$ = fromEvent(eventName)
        const pushEventValue = pushEvent(eventName)

        return [
            hasSeedValue ? events$ : events$.startWith(seedValue),
            pushEventValue
        ]
    }

    return {
        mount: data.filter(isEvent(MOUNT_EVENT)).mapTo(undefined),
        unmount: data.filter(isEvent(UNMOUNT_EVENT)).mapTo(undefined),
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
            return data()
                .filter(isCallback(propName))
                .map((data: CallbackData) => {
                    const { args } = data.payload
                    return valueTransformer ? valueTransformer(args) : args[0]
                })
        }

        if (propName) {
            return data()
                .filter(isProps)
                .map((data: PropsData<Props>) => {
                    const prop = data.payload[propName]

                    return valueTransformer ? valueTransformer(prop) : prop
                })
                .compose(dropRepeats())
        }

        return data()
            .filter(isProps)
            .map((data: PropsData<Props>) => data.payload)
            .compose(dropRepeats(shallowEquals))
    }
}

export const createComponent = <Props>(
    getProp,
    dataObservable,
    pushEvent: PushEvent,
    decoratedProps: boolean
): ObservableComponent => {
    const data = () => xs.from<Data<Props>>(dataObservable)

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
