export const PROPS_EFFECT: string = '@@refract/effect/props'

export interface PropEffect<P = object> {
    type: string
    payload: {
        replace: boolean
        props: P
    }
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
