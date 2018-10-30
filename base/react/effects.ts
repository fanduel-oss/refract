export const PROPS_EFFECT: string = '@@refract/effect/props'
export const COMPONENT_EFFECT: string = '@@refract/effect/component'

export interface PropEffect<P = object> {
    type: string
    payload: {
        replace: boolean
        props: P
    }
}

export interface ComponentEffect<D = object> {
    type: string
    payload: D
}

export const toProps = <P>(props: P): PropEffect<P> => ({
    type: PROPS_EFFECT,
    payload: {
        replace: false,
        props
    }
})

export const asProps = <P>(props: P): PropEffect<P> => ({
    type: PROPS_EFFECT,
    payload: {
        replace: true,
        props
    }
})

export const toComponent = <D>(data: D): ComponentEffect<D> => ({
    type: COMPONENT_EFFECT,
    payload: data
})
