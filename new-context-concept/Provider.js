import React, { Component } from 'react'
import RefractContext from './Context'

export default class RefractProvider extends Component {
    constructor(props) {
        super(props)

        const { dependencies, effectHandler, errorHandler, store } = props

        // should we pass all dependencies through to the consumers?
        const consumerDependencies = store
            ? Object.assign({}, dependencies, {
                  store: { observe: store.observe }
              })
            : dependencies

        const handlerDependencies = store
            ? Object.assign({}, dependencies, {
                  store: { dispatch: store.dispatch }
              })
            : dependencies

        this.context = {
            dependencies: consumerDependencies,
            dispatchEffect: effectHandler(handlerDependencies)
        }

        if (errorHandler) {
            this.context.dispatchError = errorHandler(handlerDependencies)
        }
    }

    render() {
        return (
            <RefractContext.Provider value={{ refractContext: this.context }}>
                {this.props.children}
            </RefractContext.Provider>
        )
    }
}
