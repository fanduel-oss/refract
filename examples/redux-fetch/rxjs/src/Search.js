import React, { useState } from 'react'

const Search = props => {
    const [query, setQuery] = useState('')

    const onChange = e => {
        setQuery(e.target.value)
    }

    const onSubmit = e => {
        e.preventDefault()
        props.onSubmit && props.onSubmit(query)
    }

    return (
        <form className="inline" onSubmit={onSubmit}>
            <input
                placeholder={props.placeholder}
                value={query}
                onChange={onChange}
            />
            <button type="submit">Search!</button>
        </form>
    )
}

export default Search
