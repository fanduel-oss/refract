import { from, Observable, PartialObserver as Listener } from 'rxjs'
import { map, distinctUntilChanged, startWith } from 'rxjs/operators'
import { Selector, ObserveOptions } from './baseTypes'
import { Store } from 'redux'

export interface ObserveFn {
    <T>(
        actionTypeOrListener: string | Selector<T>,
        options?: Partial<ObserveOptions>
    ): Observable<T>
}

export const observeFactory = (store): ObserveFn => {
    const storeObservable = from(store)

    return <T>(actionOrSelector, opts?: Partial<ObserveOptions>) => {
        const options: ObserveOptions = {
            initialValue: true,
            ...opts
        }
        if (typeof actionOrSelector === 'string') {
            return Observable.create((listener: Partial<Listener<T>>) => {
                const unsubscribe = store.addActionListener(
                    actionOrSelector,
                    listener.next.bind(listener)
                )

                return unsubscribe
            })
        }

        if (typeof actionOrSelector === 'function') {
            const operators = [
                map(actionOrSelector),
                options.initialValue &&
                    startWith(actionOrSelector(store.getState())),
                distinctUntilChanged<T>()
            ].filter(Boolean)

            return storeObservable.pipe<T>(...operators)
        }
    }
}
