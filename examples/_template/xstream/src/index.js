import React from 'react'
import { render } from 'react-dom'
import { withEffects } from 'refract-xstream'

const App = () => <p>Hello, world!</p>

const aperture = intialProps => component => component.observe()

const handler = initialProps => effect => {}
const errorHandler = () => err => console.error(err)

const AppWithEffects = withEffects(handler, errorHandler)(aperture)(App)

render(<AppWithEffects />, document.getElementById('root'))
