import { merge, map, pipe } from 'callbag-basics'
import startWith from 'callbag-start-with'
import {
    Aperture,
    toProps,
    asProps,
    PropEffect
} from '../../../../packages/refract-callbag/src'

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
    const [linkClick$, clickLink] = component.useEvent<any>('linkClick', '')

    return pipe(
        merge(
            map(value => ({
                type: 'ValueChange',
                value
            }))(value$),

            map(value => ({
                type: 'ValueSet',
                value
            }))(valueSet$),

            map(() => ({
                type: 'Start'
            }))(mount$),

            map(() => ({
                type: 'Stop'
            }))(unmount$),

            map(() => ({
                type: 'LinkClick'
            }))(linkClick$)
        ),
        startWith(toProps({ clickLink }))
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
    pipe(
        component.observe(),
        map(({ prop }) => ({
            newProp: `${prop} world`
        })),
        map(asProps)
    )

export const toPropsAperture: Aperture<
    SourceProps,
    PropEffect<SinkProps>
> = component =>
    pipe(
        component.observe(),
        map(({ prop }) => ({
            newProp: `${prop} world`
        })),
        map(toProps)
    )

export const createRenderingAperture = <VNode>(
    render: (prop: string) => VNode
) => {
    const aperture: Aperture<SourceProps, VNode> = component =>
        pipe(component.observe('prop'), map(render))

    return aperture
}
