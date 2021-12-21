import { configure } from 'enzyme'
import InfernoEnzymeAdapter from 'enzyme-adapter-inferno'

configure({ adapter: new InfernoEnzymeAdapter() })