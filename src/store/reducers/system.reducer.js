import { userService } from '../../services/user/user.service'

export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'
export const SET_IS_ACCESSIBILITY = 'SET_IS_ACCESSIBILITY'
export const SET_IS_PREFS = 'SET_IS_PREFS'
export const SET_PREFS = 'SET_PREFS'

const initialState = {
  isLoading: false,
  prefs: userService.getPrefs(),
  isAccessibility: false,
  isPrefs: false,
}

export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true }
    case LOADING_DONE:
      return { ...state, isLoading: false }
    case SET_IS_ACCESSIBILITY:
      return { ...state, isAccessibility: action.isAccessibility }
    default:
      return state
  }
}
