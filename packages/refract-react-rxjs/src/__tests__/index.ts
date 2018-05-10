import * as React from 'react'
import {
    withEffects,
    EffectHandler,
    EffectFactory,
    ObservableComponent
} from '../index'
import { map } from 'rxjs/operators'
import { shallow, mount } from 'enzyme'

describe('refract-react-rxjs', () => {
    interface Effect {
        type: string
        value: number
    }
    interface Props {
        value: number
    }

    const noop = (...args) => void 0

    const effectHandler: EffectHandler<Props, Effect> = props => (
        value: Effect
    ) => {
        noop(value)
    }

    const effectFactory: EffectFactory<Props, Effect> = props => component => {
        const value$ = component.observe<number>('value')

        return value$.pipe(
            map(value => ({
                type: 'MyEffect',
                value
            }))
        )
    }

    it('should create a HoC', () => {
        const WithEffects = withEffects<Props, Effect>(effectHandler)(
            effectFactory
        )(() => React.createElement('div'))
    })

    it('should observe props changing', () => {
        const effectValueHandler = jest.fn()
        const WithEffects = withEffects<Props, Effect>(
            () => effectValueHandler
        )(effectFactory)(() => React.createElement('div'))

        const component = mount(React.createElement(WithEffects, { value: 1 }))

        expect(component.prop('value')).toBe(1)
        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'MyEffect',
            value: 1
        })

        component.setProps({ value: 2 })
        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'MyEffect',
            value: 2
        })
    })
})
