export interface EnhancerOptions {
    eventsPrefix: string
    methodName: string
}
export type ActionListener = (action: object) => void
export type UnsubscribeFn = () => void
export type AddActionListener = (
    actionType: string,
    listener: ActionListener
) => UnsubscribeFn
export type Selector<Type> = (state: object) => Type
