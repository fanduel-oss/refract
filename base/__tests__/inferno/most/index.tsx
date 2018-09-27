import { createElement } from 'inferno-create-element'
import {
    withEffects,
    Handler,
    ObservableComponent,
    PropEffect
} from '../../../../packages/refract-inferno-most/src'
import {
    aperture,
    toPropsAperture,
    asPropsAperture,
    Effect,
    Props
} from '../../react/most/aperture'
import { mount } from 'enzyme'

describe('refract-inferno-most', () => {
    const noop = (...args) => void 0

    const handler: Handler<Props, Effect> = props => (value: Effect) => {
        noop(value)
    }

    it('should create a HoC', () => {
        const WithEffects = withEffects<Props, Effect>(handler)(aperture)(
            () => <div />
        )
    })

    it('should observe component changes', () => {
        const effectValueHandler = jest.fn()
        const setValue = () => void 0
        const WithEffects = withEffects<Props, Effect>(
            () => effectValueHandler
        )(aperture)(({ setValue, pushEvent }) => (
            <div>
                <button onClick={() => setValue(10)} />
                <a onClick={pushEvent('linkClick')} />
            </div>
        ))

        const component = mount(
            // @ts-ignore
            <WithEffects value={1} setValue={setValue} />
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

        component.find('button').simulate('click')

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'ValueSet',
            value: 10
        })

        component.setProps({ setValue: () => void 0 })
        component.find('button').simulate('click')

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'ValueSet',
            value: 10
        })

        component.find('a').simulate('click')

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'LinkClick'
        })

        component.unmount()

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'Stop'
        })
    })

    it('should map props to wrapped component', () => {
        interface Props {
            prop: string
        }
        interface ChildProps {
            newProp: string
        }
        const BaseComponent = jest.fn().mockReturnValue(<div />)
        const hander = () => () => void 0
        const WithEffects = withEffects<Props, PropEffect, ChildProps>(hander)(
            asPropsAperture
        )(BaseComponent)

        mount(
            // @ts-ignore
            <WithEffects prop="hello" />
        )

        const props = BaseComponent.mock.calls[0][0]

        expect(props.prop).toBeUndefined()
        expect(props.newProp).toBe('hello world')
    })

    it('should add props to wrapped component', () => {
        interface Props {
            prop: string
        }
        interface ChildProps {
            prop: string
            newProp: string
        }
        const BaseComponent = jest.fn().mockReturnValue(<div />)
        const hander = () => () => void 0
        const WithEffects = withEffects<Props, PropEffect, ChildProps>(hander)(
            toPropsAperture
        )(BaseComponent)

        mount(
            // @ts-ignore
            <WithEffects prop="hello" />
        )

        const props = BaseComponent.mock.calls[0][0]

        expect(props.prop).toBe('hello')
        expect(props.newProp).toBe('hello world')
    })
})
