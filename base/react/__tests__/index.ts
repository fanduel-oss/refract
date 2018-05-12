import * as React from 'react'
import { withEffects, EffectHandler, ObservableComponent } from '../index'
import effectFactory, { Effect, Props } from './effectFactory'
import { shallow, mount } from 'enzyme'

describe('refract-rxjs', () => {
    const noop = (...args) => void 0

    const effectHandler: EffectHandler<Props, Effect> = props => (
        value: Effect
    ) => {
        noop(value)
    }

    it('should create a HoC', () => {
        const WithEffects = withEffects<Props, Effect>(effectHandler)(
            effectFactory
        )(() => React.createElement('div'))
    })

    it('should observe component changes', () => {
        const effectValueHandler = jest.fn()
        const setValue = () => void 0
        const WithEffects = withEffects<Props, Effect>(
            () => effectValueHandler
        )(effectFactory)(({ setValue }) =>
            React.createElement('button', {
                onClick: () => setValue(10)
            })
        )

        const component = mount(
            React.createElement(WithEffects, { value: 1, setValue })
        )

        expect(component.prop('value')).toBe(1)
        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'ValueChange',
            value: 1
        })

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'Start'
        })

        component.setProps({ value: 2 })
        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'ValueChange',
            value: 2
        })

        component.simulate('click')

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'ValueSet',
            value: 10
        })

        component.setProps({ setValue: () => void 0 })
        component.simulate('click')

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'ValueSet',
            value: 10
        })

        component.unmount()

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'Stop'
        })
    })
})
