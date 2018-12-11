import { Callbag, Source, Sink } from 'callbag'
const fromObs = require('callbag-from-obs')
const dropRepeats = require('callbag-drop-repeats')
const map = require('callbag-map')
const pipe = require('callbag-pipe')

import { Selector, createObservable } from './baseTypes'

export interface ObserveFn {
    <T>(actionTypeOrListener: string | Selector<T>): Source<T>
}

export interface Listener<T> {
    next: (val: T) => void
    error: (err: any) => void
    complete: (val?: T) => void
}

export const observeFactory = (store): ObserveFn => {
    return <T>(actionOrSelector: string | Selector<T>): Source<T> => {
        if (typeof actionOrSelector === 'string') {
            return fromObs(
                createObservable((listener: Listener<T>) => {
                    const unsubscribe = store.addActionListener(
                        actionOrSelector,
                        listener.next.bind(listener)
                    )

                    return { unsubscribe }
                })
            )
        }

        if (typeof actionOrSelector === 'function') {
            return pipe(fromObs(store), map(actionOrSelector), dropRepeats())
        }
    }
}
