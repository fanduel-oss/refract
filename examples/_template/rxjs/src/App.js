import React from 'react'
import { withEffects } from 'refract-rxjs'

const App = () => <p>Hello, world!</p>

export const aperture = intialProps => component => component.observe()

export const handler = initialProps => effect => {}
const errorHandler = () => err => console.error(err)

export default withEffects(handler, errorHandler)(aperture)(App)
