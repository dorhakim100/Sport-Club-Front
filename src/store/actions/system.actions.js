import { userService } from '../../services/user'
import { socketService } from '../../services/socket.service'
import { store } from '../store'

import {
  LOADING_START,
  LOADING_DONE,
  SET_PREFS,
  SET_IS_ACCESSIBILITY,
} from '../reducers/system.reducer'

export function setIsLoading(stateToSet) {
  stateToSet
    ? store.dispatch({ type: LOADING_START })
    : store.dispatch({ type: LOADING_DONE })
}

export function setPrefs(prefs) {
  userService.setPrefs(prefs)
  store.dispatch({ type: SET_PREFS, prefs })
}

export function setIsAccessibility(stateToSet) {
  store.dispatch({ type: SET_IS_ACCESSIBILITY, isAccessibility: stateToSet })
}
