export const PROPS_EFFECT: string = '@@refract/effect/props'
export const COMPONENT_EFFECT: string = '@@refract/effect/component'
export const CALLBACK_EFFECT: string = '@@refract/effect/callback'

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

export interface CallbackEffect<Data = any> {
    type: string
    payload: {
        data?: Data
        propName: string
    }
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

export const toCallback = <Data>(propName: string) => (
    data?: Data
): CallbackEffect<Data> => ({
    type: CALLBACK_EFFECT,
    payload: {
        data,
        propName
    }
})
