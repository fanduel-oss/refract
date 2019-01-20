import $$observable from 'symbol-observable'
import { Callbag, Source, Sink } from 'callbag'
const fromObs = require('callbag-from-obs')
const dropRepeats = require('callbag-drop-repeats')
const map = require('callbag-map')
const pipe = require('callbag-pipe')

import { Selector } from './baseTypes'

export interface ObserveFn {
    <Type>(actionTypeOrListener: string | Selector<Type>): Source<Type>
}

export interface Listener<Type> {
    next: (val: Type) => void
    error: (err: any) => void
    complete: (val?: Type) => void
}

export const observeFactory = (store): ObserveFn => {
    return <Type>(actionOrSelector: string | Selector<Type>): Source<Type> => {
        if (typeof actionOrSelector === 'string') {
            return fromObs({
                subscribe(listener: Listener<Type>) {
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
            return pipe(fromObs(store), map(actionOrSelector), dropRepeats())
        }
    }
}
