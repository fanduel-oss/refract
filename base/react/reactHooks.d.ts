import * as React from 'react'

declare module 'react' {
    function useState<Type>(
        initialState: Type | (() => Type)
    ): [Type, (newState: Type) => void]
    function useEffect(
        create: () => void | (() => void),
        inputs?: ReadonlyArray<unknown>
    ): void
    function useContext<Type>(foo: React.Context<Type>): Type
    function useReducer<State, Action>(
        reducer: (state: State, action: Action) => State,
        initialState: State
    ): [State, (action: Action) => void]
    function useCallback<Callback extends (...args: never[]) => unknown>(
        callback: Callback,
        inputs?: ReadonlyArray<unknown>
    ): Callback
    function useMemo<Type>(
        create: () => Type,
        inputs?: ReadonlyArray<unknown>
    ): Type
    function useRef<Type extends unknown>(
        initialValue?: Type
    ): React.RefObject<Type>
    function useImperativeMethods<Type>(
        ref: React.Ref<Type>,
        createInstance: () => Type,
        inputs?: ReadonlyArray<unknown>
    ): void
    const useMutationEffect: typeof useEffect
    const useLayoutEffect: typeof useEffect
}
