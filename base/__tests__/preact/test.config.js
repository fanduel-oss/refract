const enzyme = require('enzyme')
const { Adapter } = require('enzyme-adapter-preact-pure')

enzyme.configure({ adapter: new Adapter() })