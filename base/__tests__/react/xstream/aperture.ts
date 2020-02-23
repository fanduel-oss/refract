import xs from 'xstream'
import {
    Aperture,
    toCallback,
    toProps,
    asProps,
    CallbackEffect,
    PropEffect
} from '../../../../packages/refract-xstream/src'

export interface Effect {
    type: string
    value?: number
}

export interface Props {
    value: number
    setValue: (value: number) => void
}

export interface ExtraProps {
    clickLink: () => void
}

export const aperture: Aperture<Props, Effect> = component => {
    const value$ = component.observe<number>('value')
    const valueSet$ = component.observe<number>('setValue')
    const mount$ = component.mount
    const unmount$ = component.unmount
    const [linkClick$, clickLink] = component.useEvent('linkClick')

    return xs.merge<Effect>(
        value$.map(value => ({
            type: 'ValueChange',
            value
        })),

        valueSet$.map(value => ({
            type: 'ValueSet',
            value
        })),

        mount$.mapTo({
            type: 'Start'
        }),

        unmount$.mapTo({
            type: 'Stop'
        }),

        linkClick$.mapTo({
            type: 'LinkClick'
        }),

        xs.of(toProps({ clickLink }))
    )
}

export interface SourceProps {
    prop: string
}
interface SinkProps {
    newProp: string
}

export const asPropsAperture: Aperture<
    SourceProps,
    PropEffect<SinkProps>
> = component =>
    component
        .observe()
        .map(({ prop }) => ({
            newProp: `${prop} world`
        }))
        .map(asProps)

export const toPropsAperture: Aperture<
    SourceProps,
    PropEffect<SinkProps>
> = component =>
    component
        .observe()
        .map(({ prop }) => ({
            newProp: `${prop} world`
        }))
        .map(toProps)

export const toMergedPropsAperture: Aperture<
    SourceProps,
    PropEffect<{
        prop1?: number
        prop2?: number
    }>
> = () => xs.of<any>(toProps({ prop1: 1 }), toProps({ prop2: 2 }))

export const createRenderingAperture = <VNode>(
    render: (prop: string) => VNode
) => {
    const aperture: Aperture<SourceProps, VNode> = component =>
        component.observe('prop').map(render)

    return aperture
}

export const toCallbackAperture: Aperture<
    { callback: () => void },
    CallbackEffect<string>
> = component =>
    component.mount.map(() => 'Hello world!').map(toCallback('callback'))
