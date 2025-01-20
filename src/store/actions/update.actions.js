import { updateService } from '../../services/update/update.service'

import { store } from '../store'
import {
  ADD_UPDATE,
  REMOVE_UPDATE,
  SET_UPDATES,
  LOAD_UPDATE,
} from '../reducers/update.reducer'

export async function loadUpdates(filter) {
  try {
    const updates = await updateService.query(filter)
    store.dispatch({ type: SET_UPDATES, updates })
  } catch (err) {
    // console.log('UpdateActions: err in loadUpdates', err)
    throw err
  }
}

export async function addUpdate(update) {
  try {
    const addedUpdate = await updateService.add(update)
    store.dispatch(getActionAddReview(addedUpdate))
  } catch (err) {
    // console.log('UpdateActions: err in addUpdate', err)
    throw err
  }
}

export async function removeUpdate(reviewId) {
  try {
    await updateService.remove(reviewId)
    store.dispatch(getActionRemoveUpdate(reviewId))
  } catch (err) {
    // console.log('UpdateActions: err in removeUpdate', err)
    throw err
  }
}

export async function loadUpdate(updateId) {
  try {
    const update = await updateService.getById(updateId)
    store.dispatch({ type: LOAD_UPDATE, update })
  } catch (err) {
    // console.log(err)
    throw err
  }
}

export async function saveUpdate(newUpdate) {
  try {
    const saved = await updateService.save(newUpdate)
    // return {
    //   type: UPDATE_ITEM,
    //   item,
    // }
    return saved
  } catch (err) {
    // console.log(err)
    throw err
  }
}

export function setUpdateOrder(newOrder) {
  store.dispatch({ type: SET_UPDATES, updates: newOrder })
}

// Command Creators
export function getActionRemoveUpdate(reviewId) {
  return { type: REMOVE_UPDATE, reviewId }
}
export function getActionAddUpdate(update) {
  return { type: ADD_UPDATE, update }
}
