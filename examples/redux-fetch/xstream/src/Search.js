import React, { Component } from 'react'

class Search extends Component {
    state = { query: '' }

    onChange = e => {
        this.setState({ query: e.target.value })
    }

    onSubmit = e => {
        e.preventDefault()
        this.props.onSubmit && this.props.onSubmit(this.state.query)
    }

    render() {
        return (
            <form className="inline" onSubmit={this.onSubmit}>
                <input
                    placeholder={this.props.placeholder}
                    value={this.state.query}
                    onChange={this.onChange}
                />
                <button type="submit">Search!</button>
            </form>
        )
    }
}

export default Search
