import { userService } from '../../services/user/user.service'

export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'
export const SET_IS_ACCESSIBILITY = 'SET_IS_ACCESSIBILITY'
export const SET_IS_PREFS = 'SET_IS_PREFS'
export const SET_PREFS = 'SET_PREFS'
export const SET_IS_MODAL = 'SET_IS_MODAL'
export const SET_MODAL_MESSAGE = 'SET_MODAL_MESSAGE'
export const SET_SHOWED_UPDATE_MESSAGE = 'SET_SHOWED_UPDATE_MESSAGE'
export const SET_IS_SCROLLED = 'SET_IS_SCROLLED'

const initialState = {
  isLoading: false,
  prefs: userService.getPrefs(),
  isAccessibility: false,
  isPrefs: false,
  schedule:
    'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729158737/%D7%97%D7%95%D7%92%D7%99%D7%9D_%D7%97%D7%93%D7%A9_%D7%9E%D7%A2%D7%95%D7%93%D7%9B%D7%9F_8-2024-1_kceouw.png',
  isModal: false,
  modalMessage: { he: '', eng: '' },
  showedUpdateMessage: false,
  isScrolled: false,
}

export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true }
    case LOADING_DONE:
      return { ...state, isLoading: false }
    case SET_IS_ACCESSIBILITY:
      return { ...state, isAccessibility: action.isAccessibility }
    case SET_IS_PREFS:
      return { ...state, isPrefs: action.isPrefs }
    case SET_PREFS:
      return { ...state, prefs: action.prefs }
    case SET_IS_MODAL:
      return { ...state, isModal: action.isModal }
    case SET_MODAL_MESSAGE:
      return { ...state, modalMessage: action.modalMessage }
    case SET_SHOWED_UPDATE_MESSAGE:
      return { ...state, showedUpdateMessage: action.showedUpdateMessage }
    case SET_IS_SCROLLED:
      return { ...state, isScrolled: action.isScrolled }
    default:
      return state
  }
}
