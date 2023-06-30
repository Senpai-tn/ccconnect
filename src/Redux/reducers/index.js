import { combineReducers } from 'redux'
import userReducer from './userReducer'
import themeReducer from './themeReducer'
const rootReducer = combineReducers({ user: userReducer, ui: themeReducer })
export default rootReducer
