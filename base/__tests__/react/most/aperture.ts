import { merge } from 'most'

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

export const aperture: Aperture<Props, Effect> = props => component => {
    const value$ = component.observe<number>('value')
    const valueSet$ = component.observe<number>('setValue')
    const mount$ = component.mount$
    const unmount$ = component.unmount$
    const linkClick$ = component.event<any>('linkClick')

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
        })
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
> = () => component =>
    component
        .observe()
        .map(({ prop }) => ({
            newProp: `${prop} world`
        }))
        .map(asProps)

export const toPropsAperture: Aperture<
    SourceProps,
    PropEffect<SinkProps>
> = () => component =>
    component
        .observe()
        .map(({ prop }) => ({
            newProp: `${prop} world`
        }))
        .map(toProps)

export const createRenderingAperture = <VNode>(
    render: (prop: string) => VNode
) => {
    const aperture: Aperture<SourceProps, VNode> = () => component =>
        component.observe('prop').map(render)

    return aperture
}
