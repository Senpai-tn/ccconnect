import { actions } from '../actions'

const initialState = {
  isDark: localStorage.getItem('isDark') === 'true',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.change_theme:
      localStorage.setItem('isDark', action.theme)
      return {
        ...state,
        isDark: action.theme,
      }
    default:
      return state
  }
}

export default reducer
