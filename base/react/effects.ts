export const PROPS_EFFECT: string = '@@refract/effect/props'
export const COMPONENT_EFFECT: string = '@@refract/effect/component'

export interface PropEffect<Props = object> {
    type: string
    payload: {
        replace: boolean
        props: Props
    }
}

export interface ComponentEffect<Data = object> {
    type: string
    payload: Data
}

export const toProps = <Props>(props: Props): PropEffect<Props> => ({
    type: PROPS_EFFECT,
    payload: {
        replace: false,
        props
    }
})

export const asProps = <Props>(props: Props): PropEffect<Props> => ({
    type: PROPS_EFFECT,
    payload: {
        replace: true,
        props
    }
})

export const toRender = <Data>(data: Data): ComponentEffect<Data> => ({
    type: COMPONENT_EFFECT,
    payload: data
})
