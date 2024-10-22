import { updateService } from '../../services/update/update.service'

import { store } from '../store'
import {
  ADD_UPDATE,
  REMOVE_UPDATE,
  SET_UPDATES,
} from '../reducers/update.reducer'

export async function loadUpdates(filter) {
  try {
    const updates = await updateService.query(filter)
    store.dispatch({ type: SET_UPDATES, updates })
  } catch (err) {
    console.log('UpdateActions: err in loadUpdates', err)
    throw err
  }
}

export async function addUpdate(update) {
  try {
    const addedUpdate = await updateService.add(update)
    store.dispatch(getActionAddReview(addedUpdate))
  } catch (err) {
    console.log('UpdateActions: err in addUpdate', err)
    throw err
  }
}

export async function removeUpdate(reviewId) {
  try {
    await updateService.remove(reviewId)
    store.dispatch(getActionRemoveUpdate(reviewId))
  } catch (err) {
    console.log('UpdateActions: err in removeUpdate', err)
    throw err
  }
}
// Command Creators
export function getActionRemoveUpdate(reviewId) {
  return { type: REMOVE_UPDATE, reviewId }
}
export function getActionAddUpdate(update) {
  return { type: ADD_UPDATE, update }
}
