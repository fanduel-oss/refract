import { merge, of, from } from 'most'

import {
    Aperture,
    toProps,
    asProps,
    PropEffect
} from '../../../../packages/refract-most/src'

export interface Effect {
    type: string
    value?: number
}

export interface Props {
    value: number
    setValue: (value: number) => void
}

export const aperture: Aperture<Props, Effect> = component => {
    const value$ = component.observe<number>('value')
    const valueSet$ = component.observe<number>('setValue')
    const mount$ = component.mount
    const unmount$ = component.unmount
    const [linkClick$, clickLink] = component.useEvent('linkClick')

    return merge<Effect>(
        value$.map(value => ({
            type: 'ValueChange',
            value
        })),

        valueSet$.map(value => ({
            type: 'ValueSet',
            value
        })),

        mount$.constant({
            type: 'Start'
        }),

        unmount$.constant({
            type: 'Stop'
        }),

       linkClick$.constant({
            type: 'LinkClick'
        }),

        of(
            toProps({
                clickLink
            })
        )
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
> = () => merge<any>(of(toProps({ prop1: 1 })), of(toProps({ prop2: 2 })))

export const createRenderingAperture = <VNode>(
    render: (prop: string) => VNode
) => {
    const aperture: Aperture<SourceProps, VNode> = component =>
        component.observe('prop').map(render)

    return aperture
}
