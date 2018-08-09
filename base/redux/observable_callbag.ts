import $$observable from 'symbol-observable'
import { Callbag, Source, Sink } from 'callbag'
const fromObs = require('callbag-from-obs')
const dropRepeats = require('callbag-drop-repeats')
const map = require('callbag-map')
const pipe = require('callbag-pipe')
const startWith = require('callbag-start-with')

import { Selector } from './baseTypes'

export interface ObserveFn {
    <T>(actionTypeOrListener: string | Selector<T>): Source<T>
}

export interface Listener<T> {
    next: (val: T) => void
    error: (err: any) => void
    complete: (val?: T) => void
}

export const observeFactory = (store): ObserveFn => {
    const storeObservable = fromObs(store)

    return <T>(actionOrSelector: string | Selector<T>): Source<T> => {
        if (typeof actionOrSelector === 'string') {
            return fromObs({
                subscribe(listener: Listener<T>) {
                    const unsubscribe = store.addActionListener(
                        actionOrSelector,
                        listener.next.bind(listener)
                    )

                    return { unsubscribe }
                },
                [$$observable]() {
                    return this
                }
            })
        }

        if (typeof actionOrSelector === 'function') {
            return pipe(
                storeObservable,
                map(actionOrSelector),
                startWith(actionOrSelector(store.getState())),
                dropRepeats()
            )
        }
    }
}
