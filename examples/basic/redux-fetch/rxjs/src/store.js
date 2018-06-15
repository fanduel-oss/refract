import { combineReducers } from 'redux'

const ERROR_RECEIVE = 'ERROR_RECEIVE'
const USER_REQUEST = 'USER_REQUEST'
const USER_RECEIVE = 'USER_RECEIVE'
const USER_SELECT = 'USER_SELECT'

export const actionTypes = {
    ERROR_RECEIVE,
    USER_REQUEST,
    USER_RECEIVE,
    USER_SELECT
}

const receiveError = payload => ({
    type: ERROR_RECEIVE,
    payload
})

const requestUser = payload => ({
    type: USER_REQUEST,
    payload
})

const receiveUser = payload => ({
    type: USER_RECEIVE,
    payload
})

const selectUser = payload => ({
    type: USER_SELECT,
    payload
})

export const actionCreators = {
    receiveError,
    requestUser,
    receiveUser,
    selectUser
}

const users = (state = {}, action) => {
    switch (action.type) {
        case USER_RECEIVE: {
            return {
                ...state,
                [action.payload.login]: action.payload
            }
        }

        default: {
            return state
        }
    }
}

const active = (state = null, action) => {
    switch (action.type) {
        case USER_REQUEST: {
            return null
        }

        case USER_RECEIVE: {
            return action.payload.login
        }

        case USER_SELECT: {
            return action.payload
        }

        default: {
            return state
        }
    }
}

const getUsers = state => state.users
const getUser = user => state => getUsers(state)[user]
const getActive = state => state.active

export const selectors = {
    getUsers,
    getUser,
    getActive
}

export default combineReducers({
    users,
    active
})
