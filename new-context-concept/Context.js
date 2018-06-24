import { createContext } from 'react'

// is this necessary to ensure context is only created
// once even if user imports provider multiple times?
let RefractContext
if (!RefractContext) {
    RefractContext = createContext()
}

export default RefractContext
