import { Component } from 'react'

class StateContainer extends Component {
    state = { count: 0, direction: 'NONE' }
    setDirection = direction => this.setState({ direction })
    setState = this.setState.bind(this)

    render() {
        const { count, direction } = this.state
        const { setDirection, setState } = this

        return this.props.children({
            count,
            direction,
            setDirection,
            setState
        })
    }
}

export default StateContainer
