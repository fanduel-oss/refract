import * as React from 'react'
import {
    withEffects,
    Handler,
    PropEffect
} from '../../../../packages/refract-callbag/src'
import {
    aperture,
    toPropsAperture,
    asPropsAperture,
    Effect,
    Props,
    ExtraProps,
    createRenderingAperture,
    toMergedPropsAperture
} from './aperture'
import { render, fireEvent } from '@testing-library/react'

describe('refract-callbag', () => {
    const noop = (...args) => void 0

    const handler: Handler<Props, Effect> = props => (value: Effect) => {
        noop(value)
    }

    it('should create a HoC', () => {
        withEffects<Props, Effect>(aperture, { handler })(() => <div />)
    })

    it('should observe component changes', () => {
        const effectValueHandler = jest.fn()
        const setValue = () => void 0
        const WithEffects = withEffects<Props, Effect, Props & ExtraProps>(
            aperture,
            { handler: () => effectValueHandler }
        )(({ setValue, clickLink }) => (
            <div>
                <button
                    onClick={() => setValue(10)}
                    data-testid="valueButton"
                />
                <a onClick={() => clickLink()} data-testid="link" />
            </div>
        ))

        const Element = props => <WithEffects {...props} />
        const { rerender, unmount, getByTestId } = render(
            <Element value={1} setValue={setValue} />
        )

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'ValueChange',
            value: 1
        })

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'Start'
        })

        rerender(<Element value={2} setValue={setValue} />)
        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'ValueChange',
            value: 2
        })

        fireEvent(
            getByTestId('valueButton'),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            })
        )

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'ValueSet',
            value: 10
        })

        rerender(<Element setValue={() => void 0} />)
        fireEvent(
            getByTestId('valueButton'),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            })
        )

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'ValueSet',
            value: 10
        })

        fireEvent(
            getByTestId('link'),
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            })
        )

        expect(effectValueHandler).toHaveBeenCalledWith({
            type: 'LinkClick'
        })

        unmount()

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
        const WithEffects = withEffects<Props, PropEffect, ChildProps>(
            asPropsAperture
        )(BaseComponent)

        const Element = props => <WithEffects {...props} />
        const { rerender } = render(<Element prop="hello" />)

        let props = BaseComponent.mock.calls[0][0]

        expect(props.prop).toBeUndefined()
        expect(props.newProp).toBe('hello world')

        rerender(<Element prop="this" />)

        props = BaseComponent.mock.calls[1][0]

        expect(props.prop).toBeUndefined()
        expect(props.newProp).toBe('this world')
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
        const WithEffects = withEffects<Props, PropEffect, ChildProps>(
            toPropsAperture
        )(BaseComponent)

        const Element = props => <WithEffects {...props} />
        const { rerender } = render(<Element prop="hello" />)

        let props = BaseComponent.mock.calls[0][0]

        expect(props.prop).toBe('hello')
        expect(props.newProp).toBe('hello world')

        rerender(<Element prop="this" />)

        props = BaseComponent.mock.calls[1][0]

        expect(props.prop).toBe('this')
        expect(props.newProp).toBe('this world')
    })

    it('should not merge props by default', () => {
        const BaseComponent = jest.fn().mockReturnValue(<div />)
        const WithEffects = withEffects<{ prop }, PropEffect>(
            toMergedPropsAperture
        )(BaseComponent)

        const Element = props => <WithEffects {...props} />
        render(<Element />)

        const props = BaseComponent.mock.calls[0][0]

        expect(props.prop1).toBeUndefined()
        expect(props.prop2).toBe(2)
    })

    it('should not merge props by default', () => {
        const BaseComponent = jest.fn().mockReturnValue(<div />)
        const WithEffects = withEffects<{ prop }, PropEffect>(
            toMergedPropsAperture,
            {
                mergeProps: true
            }
        )(BaseComponent)

        const Element = props => <WithEffects {...props} />
        render(<Element />)

        const props = BaseComponent.mock.calls[0][0]

        expect(props.prop1).toBe(1)
        expect(props.prop2).toBe(2)
    })

    it('should render virtual elements', () => {
        const aperture = createRenderingAperture<React.ReactNode>(prop => (
            <div data-testid="apertureDiv">{prop}</div>
        ))
        const WithEffects = withEffects<{ prop }, React.ReactNode>(aperture)()

        const Element = props => <WithEffects {...props} />
        const { rerender, getByTestId } = render(<Element prop="hello" />)

        expect(getByTestId('apertureDiv').textContent).toBe('hello')

        rerender(<Element prop="hi" />)

        expect(getByTestId('apertureDiv').textContent).toBe('hi')
    })

    it('should throw an error if the aperture does not return anything', () => {
        // prevent the error from being passed through to the console
        jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn())

        // tslint:disable-next-line
        const aperture = () => {}
        const MyComponent: React.FC<{}> = () => <div />
        const WithEffects = withEffects<any, any>(aperture as any)(MyComponent)

        const Element = props => <WithEffects {...props} />

        expect(() => render(<Element />)).toThrow()

        jest.clearAllMocks()
    })
})
