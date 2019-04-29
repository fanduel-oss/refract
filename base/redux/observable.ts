import { from, Observable, PartialObserver as Listener } from 'rxjs'
import { map, distinctUntilChanged } from 'rxjs/operators'
import { Selector } from './baseTypes'
import { Store } from 'redux'

export interface StoreObserveFunction {
    <Type>(actionTypeOrListener: string | Selector<Type>): Observable<Type>
}

export const observeFactory = (store): StoreObserveFunction => {
    return <Type>(actionOrSelector) => {
        if (typeof actionOrSelector === 'string') {
            return Observable.create((listener: Partial<Listener<Type>>) => {
                const unsubscribe = store.addActionListener(
                    actionOrSelector,
                    listener.next.bind(listener)
                )

                return unsubscribe
            })
        }

        if (typeof actionOrSelector === 'function') {
            return from(store).pipe<Type>(
                map(actionOrSelector),
                distinctUntilChanged<Type>()
            )
        }
    }
}
