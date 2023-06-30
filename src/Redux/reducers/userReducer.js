import { actions } from '../actions'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.login:
      return { ...state, user: action.user }
    case actions.change_loading: {
      return { ...state, loading: action.loading }
    }
    default: {
      return state
    }
  }
}

export default reducer
