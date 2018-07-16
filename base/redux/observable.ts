import { from, Observable, PartialObserver as Listener } from 'rxjs'
import { map, distinctUntilChanged, startWith } from 'rxjs/operators'
import { Selector } from './baseTypes'
import { Store } from 'redux'

export interface ObserveFn {
    <T>(actionTypeOrListener: string | Selector<T>): Observable<T>
}

export const observeFactory = (store): ObserveFn => {
    const storeObservable = from(store)

    return <T>(actionOrSelector) => {
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
            return storeObservable.pipe<T>(
                map(actionOrSelector),
                startWith(actionOrSelector(store.getState())),
                distinctUntilChanged<T>()
            )
        }
    }
}
