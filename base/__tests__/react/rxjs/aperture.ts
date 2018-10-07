import { map, mapTo } from 'rxjs/operators'
import { merge } from 'rxjs'

import {
    Aperture,
    toProps,
    asProps,
    PropEffect
} from '../../../../packages/refract-rxjs/src'

export interface Effect {
    type: string
    value?: number
    payload?: object
}

export interface Props {
    value: number
    setValue: (value: number) => void
}

export const aperture: Aperture<Props, Effect> = props => component => {
    const value$ = component.observe<number>('value')
    const valueSet$ = component.observe<number>('setValue')
    const mount$ = component.event('mount')
    const unmount$ = component.event('unmount')
    const linkClick$ = component.event<any>('linkClick')

    return merge<Effect>(
        value$.pipe(
            map(value => ({
                type: 'ValueChange',
                value
            }))
        ),

        valueSet$.pipe(
            map(value => ({
                type: 'ValueSet',
                value
            }))
        ),

        mount$.pipe(
            mapTo({
                type: 'Start'
            })
        ),

        unmount$.pipe(
            mapTo({
                type: 'Stop'
            })
        ),

        linkClick$.pipe(
            mapTo({
                type: 'LinkClick'
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
> = () => component =>
    component.observe().pipe(
        map(({ prop }) => ({
            newProp: `${prop} world`
        })),
        map(asProps)
    )

export const toPropsAperture: Aperture<
    SourceProps,
    PropEffect<SinkProps>
> = () => component =>
    component.observe().pipe(
        map(({ prop }) => ({
            newProp: `${prop} world`
        })),
        map(toProps)
    )

export const createRenderingAperture = <VNode>(
    render: (prop: string) => VNode
) => {
    const aperture: Aperture<SourceProps, VNode> = () => component =>
        component.observe('prop').pipe(map(render))

    return aperture
}
