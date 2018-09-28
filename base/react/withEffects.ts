import * as React from 'react'

import configureComponent from './configureComponent'

import { Handler, ErrorHandler, PushEvent } from './baseTypes'
import { Aperture } from './observable'
import { ReactElement } from 'react'

export interface State {
    replace?: boolean
    props: object
    decoratedProps: object
    children: React.ReactNode | null
}

const Empty = () => null

export const withEffects = <P, E, CP = P>(
    handler: Handler<P, E>,
    errorHandler?: ErrorHandler<P>
) => (aperture: Aperture<P, E>) => (
    BaseComponent: React.ComponentType<CP & { pushEvent: PushEvent }> = Empty
): React.ComponentClass<P> =>
    class WithEffects extends React.Component<P, State> {
        private triggerMount: () => void
        private triggerUnmount: () => void
        private havePropsChanged: (nextProps: P, nextState: State) => boolean
        private reDecorateProps: (nextProps: P) => void
        private pushProps: (props: P) => void
        private getChildProps: () => CP & { pushEvent: PushEvent }
        private mounted: boolean = false
        private unmounted: boolean = false

        constructor(props: any, context: any) {
            super(props, context)

            configureComponent(handler, errorHandler)(
                aperture,
                this,
                React.isValidElement
            )
        }

        public componentDidMount() {
            this.mounted = true
            this.triggerMount()
        }

        public componentWillReceiveProps(nextProps: P) {
            this.reDecorateProps(nextProps)
        }

        public shouldComponentUpdate(nextProps, nextState) {
            return this.havePropsChanged(nextProps, nextState)
        }

        public componentDidUpdate(prevProps: P) {
            this.pushProps(prevProps)
        }

        public componentWillUnmount() {
            this.unmounted = true
            this.triggerUnmount()
        }

        public render() {
            if (this.state.children) {
                return this.state.children
            }

            return React.createElement(BaseComponent, this.getChildProps())
        }
    }
