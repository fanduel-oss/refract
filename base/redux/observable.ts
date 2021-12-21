import { Store } from 'redux'
import { from, Observable, PartialObserver as Listener } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { Selector } from './baseTypes'

export type StoreObserveFunction = (store: Store) => <T>(actionTypeOrListener: string | Selector<T>) => Observable<T>

export const observeFactory: StoreObserveFunction = (store) => {
    return <T>(actionOrSelector) => {
        if (typeof actionOrSelector === 'string') {
            return new Observable((listener: Partial<Listener<T>>) => {
                const unsubscribe = store.addActionListener(
                    actionOrSelector,
                    listener.next.bind(listener)
                )

                return unsubscribe
            })
        }

        if (typeof actionOrSelector === 'function') {
            return (from(store) as any).pipe(
                map(actionOrSelector),
                distinctUntilChanged()
            )
        }
    }
}
