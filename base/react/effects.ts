export const PROPS_EFFECT: string = '@@refract/effect/props'

export const toProps = props => ({
    type: PROPS_EFFECT,
    payload: {
        replace: false,
        props
    }
})

export const asProps = props => ({
    type: PROPS_EFFECT,
    payload: {
        replace: true,
        props
    }
})
