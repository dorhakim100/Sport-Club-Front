import { userService } from '../../services/user/user.service'
import { socketService } from '../../services/socket.service'
import { store } from '../store'

import {
  LOADING_START,
  LOADING_DONE,
  SET_PREFS,
  SET_IS_ACCESSIBILITY,
  SET_IS_PREFS,
  SET_IS_MODAL,
  SET_MODAL_MESSAGE,
  SET_SHOWED_UPDATE_MESSAGE,
  SET_IS_SCROLLED,
} from '../reducers/system.reducer'

export function setIsLoading(stateToSet) {
  stateToSet
    ? store.dispatch({ type: LOADING_START })
    : store.dispatch({ type: LOADING_DONE })
}

export function setPrefs(prefsToSet) {
  const prefs = { ...prefsToSet }
  userService.setPrefs(prefs)
  store.dispatch({ type: SET_PREFS, prefs })
}
export function setIsPrefs(stateToSet) {
  store.dispatch({ type: SET_IS_PREFS, isPrefs: stateToSet })
}
export function setIsShowedUpdateMessage(stateToSet) {
  sessionStorage.setItem('showedUpdateMessage', stateToSet)
  store.dispatch({
    type: SET_SHOWED_UPDATE_MESSAGE,
    showedUpdateMessage: stateToSet,
  })
}

export function setIsAccessibility(stateToSet) {
  store.dispatch({ type: SET_IS_ACCESSIBILITY, isAccessibility: stateToSet })
}

export function setIsModal(stateToSet) {
  store.dispatch({ type: SET_IS_MODAL, isModal: stateToSet })
}
export function setModalMessage(messageToSet) {
  store.dispatch({ type: SET_MODAL_MESSAGE, modalMessage: messageToSet })
}
export function setIsScrolled(stateToSet) {
  store.dispatch({ type: SET_IS_SCROLLED, isScrolled: stateToSet })
}
