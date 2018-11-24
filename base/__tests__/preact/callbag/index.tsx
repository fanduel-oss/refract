import { h } from 'preact'
import {
    withEffects,
    Handler,
    ObservableComponent
} from '../../../../packages/refract-preact-callbag/src'
import { aperture, Effect, Props } from '../../react/callbag/aperture'
import { mount } from 'enzyme'

describe('refract-preact-callbag', () => {
    const noop = (...args) => void 0

    const handler: Handler<Props, Effect> = props => (value: Effect) => {
        noop(value)
    }

    it('should create a HoC', () => {
        withEffects<Props, Effect>(aperture, { handler })(() => <div />)
    })

    // it('should observe component changes', () => {
    //     const effectValueHandler = jest.fn()
    //     const setValue = () => void 0
    //     const WithEffects = withEffects<Props, Effect>(
    //         {handler: () => effectValueHandler }
    //     )(aperture)(({ setValue, pushEvent }) => (
    //         <div>
    //             <button onClick={() => setValue(10)} />
    //             <a onClick={pushEvent('linkClick')} />
    //         </div>
    //     ))

    //     const component = mount(
    //         // @ts-ignore
    //         <WithEffects value={1} setValue={setValue} />
    //     )

    //     expect(component.prop('value')).toBe(1)
    //     expect(effectValueHandler).toHaveBeenCalledWith({
    //         type: 'ValueChange',
    //         value: 1
    //     })

    //     expect(effectValueHandler).toHaveBeenCalledWith({
    //         type: 'Start'
    //     })

    //     component.setProps({ value: 2 })
    //     expect(effectValueHandler).toHaveBeenCalledWith({
    //         type: 'ValueChange',
    //         value: 2
    //     })

    //     component.find('button').simulate('click')

    //     expect(effectValueHandler).toHaveBeenCalledWith({
    //         type: 'ValueSet',
    //         value: 10
    //     })

    //     component.setProps({ setValue: () => void 0 })
    //     component.find('button').simulate('click')

    //     expect(effectValueHandler).toHaveBeenCalledWith({
    //         type: 'ValueSet',
    //         value: 10
    //     })

    //     component.find('a').simulate('click')

    //     expect(effectValueHandler).toHaveBeenCalledWith({
    //         type: 'LinkClick'
    //     })

    //     component.unmount()

    //     expect(effectValueHandler).toHaveBeenCalledWith({
    //         type: 'Stop'
    //     })
    // })
})
