import { from, Observable, PartialObserver as Listener } from 'rxjs'
import { distinctUntilChanged, map } from 'rxjs/operators'
import { Selector } from './baseTypes'

export interface StoreObserveFunction {
    <Type>(actionTypeOrListener: string | Selector<Type>): Observable<Type>
}

export const observeFactory = (store): StoreObserveFunction => {
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
            return from(store).pipe(
                map<unknown, T>(actionOrSelector),
                distinctUntilChanged()
            )
        }
    }
}
