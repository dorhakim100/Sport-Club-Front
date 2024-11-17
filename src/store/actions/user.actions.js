import { userService } from '../../services/user/user.service'
import { socketService } from '../../services/socket.service'
import { store } from '../store'

import { showErrorMsg } from '../../services/event-bus.service'
import { LOADING_DONE, LOADING_START } from '../reducers/system.reducer'
import {
  REMOVE_USER,
  SET_USER,
  SET_USERS,
  SET_WATCHED_USER,
  UPDATE_CART,
  SET_TOTAL,
  // SET_PREFS,
} from '../reducers/user.reducer'
import { setPrefs } from './system.actions'

export async function loadUsers() {
  try {
    store.dispatch({ type: LOADING_START })
    const users = await userService.getUsers()
    store.dispatch({ type: SET_USERS, users })
  } catch (err) {
    console.log('UserActions: err in loadUsers', err)
  } finally {
    store.dispatch({ type: LOADING_DONE })
  }
}

export async function removeUser(userId) {
  try {
    await userService.remove(userId)
    store.dispatch({ type: REMOVE_USER, userId })
  } catch (err) {
    console.log('UserActions: err in removeUser', err)
  }
}

export async function login(credentials) {
  try {
    const user = await userService.login(credentials)
    console.log(user)
    const cart = [...user.items] || []

    store.dispatch({ type: UPDATE_CART, cart })
    store.dispatch({
      type: SET_USER,
      user,
    })
    // socketService.login(user._id)
    return user
  } catch (err) {
    console.log('Cannot login', err)
    throw err
  }
}

export function setRemembered(user) {
  store.dispatch({
    type: SET_USER,
    user,
  })
  if (user) {
    store.dispatch({ type: UPDATE_CART, cart: user.items })
  }
}

export async function signup(credentials) {
  try {
    const user = await userService.signup(credentials)
    store.dispatch({
      type: SET_USER,
      user,
    })
    // socketService.login(user._id)
    return user
  } catch (err) {
    console.log('Cannot signup', err)
    throw err
  }
}

export async function logout() {
  try {
    await userService.logout()
    store.dispatch({
      type: SET_USER,
      user: null,
    })

    // socketService.logout()
  } catch (err) {
    console.log('Cannot logout', err)
    throw err
  }
}

export async function loadUser(userId) {
  try {
    const user = await userService.getById(userId)
    store.dispatch({ type: SET_WATCHED_USER, user })
  } catch (err) {
    showErrorMsg('Cannot load user')
    console.log('Cannot load user', err)
  }
}

export async function updateCart(user) {
  const cart = [...user.items]

  store.dispatch({ type: UPDATE_CART, cart })
  store.dispatch({ type: SET_USER, user })

  try {
    const saved = await userService.update(user)
  } catch (err) {
    console.log(err)
    throw err
  }
}

export function setCartTotal(total) {
  store.dispatch({ type: SET_TOTAL, total })
}

// export function setPrefs(prefs) {
//   userService.setPrefs(prefs)
//   store.dispatch({ type: SET_PREFS, prefs })
// }
