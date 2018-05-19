import { StoreEnhancer, AnyAction, Action } from 'redux'
import { ObserveFn } from './observable'
import { AddActionListener, EnhancerOptions } from './baseTypes'
declare module 'redux' {
    interface Store {
        addActionListener: AddActionListener
        observe: ObserveFn
    }
}
export default function refractStoreEnhancer<
    S = any,
    A extends Action<any> = AnyAction
>(options?: Partial<EnhancerOptions>): StoreEnhancer
