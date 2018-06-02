import $$observable from 'symbol-observable'
const fromObs = require('callbag-from-obs')
const dropRepeats = require('callbag-drop-repeats')
const map = require('callbag-map')
const pipe = require('callbag-pipe')
const startWith = require('callbag-start-with')

import { Selector, ObserveOptions } from './baseTypes'

export interface ObserveFn {
    <T>(
        actionTypeOrListener: string | Selector<T>,
        options: Partial<ObserveOptions>
    ): Source<T>
}

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

export const observeFactory = (store): ObserveFn => {
    const storeObservable = fromObs(store)

    return <T>(
        actionOrSelector: string | Selector<T>,
        opts: Partial<ObserveOptions>
    ): Source<T> => {
        const options: ObserveOptions = {
            initialValue: true,
            ...opts
        }
        if (typeof actionOrSelector === 'string') {
            return fromObs({
                subscribe(listener: Listener<T>) {
                    const unsubscribe = store.addActionListener(
                        actionOrSelector
                    )

                    return { unsubscribe }
                },
                [$$observable]() {
                    return this
                }
            })
        }

        if (typeof actionOrSelector === 'function') {
            const operators = [
                map(actionOrSelector),
                options.initialValue &&
                    startWith(actionOrSelector(store.getState())),
                dropRepeats()
            ].filter(Boolean)

            return pipe(storeObservable, ...operators)
        }
    }
}
