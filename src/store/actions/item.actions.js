import { itemService } from '../../services/item/item.service'
import { store } from '../store'
import {
  ADD_ITEM,
  REMOVE_ITEM,
  SET_ITEMS,
  SET_ITEM,
  UPDATE_ITEM,
  ADD_ITEM_MSG,
  SET_ITEM_FILTER,
} from '../reducers/item.reducer'

export async function loadItems(filterBy) {
  try {
    const items = await itemService.query(filterBy)

    store.dispatch(getCmdSetItems(items))
    store.dispatch({ type: SET_ITEM_FILTER, filter: filterBy })
    return items
  } catch (err) {
    // console.log('Cannot load items', err)
    throw err
  }
}

export async function loadItem(itemId, filter) {
  try {
    const item = await itemService.getById(itemId, filter)
    store.dispatch(getCmdSetItem(item))
    return item
  } catch (err) {
    // console.log('Cannot load item', err)
    throw err
  }
}

export async function removeItem(itemId) {
  try {
    await itemService.remove(itemId)
    store.dispatch(getCmdRemoveItem(itemId))
  } catch (err) {
    // console.log('Cannot remove item', err)
    throw err
  }
}

export async function addItem(item) {
  try {
    const savedItem = await itemService.save(item)
    store.dispatch(getCmdAddItem(savedItem))
    return savedItem
  } catch (err) {
    // console.log('Cannot add item', err)
    throw err
  }
}

export async function updateItem(item) {
  try {
    const savedItem = await itemService.save(item)
    store.dispatch(getCmdUpdateItem(savedItem))
    return savedItem
  } catch (err) {
    // console.log('Cannot save item', err)
    throw err
  }
}

export async function addItemMsg(itemId, txt) {
  try {
    const msg = await itemService.addItemMsg(itemId, txt)
    store.dispatch(getCmdAddItemMsg(msg))
    return msg
  } catch (err) {
    // console.log('Cannot add item msg', err)
    throw err
  }
}

// Command Creators:
function getCmdSetItems(items) {
  return {
    type: SET_ITEMS,
    items,
  }
}
function getCmdSetItem(item) {
  return {
    type: SET_ITEM,
    item,
  }
}
function getCmdRemoveItem(itemId) {
  return {
    type: REMOVE_ITEM,
    itemId,
  }
}
function getCmdAddItem(item) {
  return {
    type: ADD_ITEM,
    item,
  }
}
function getCmdUpdateItem(item) {
  return {
    type: UPDATE_ITEM,
    item,
  }
}
function getCmdAddItemMsg(msg) {
  return {
    type: ADD_ITEM_MSG,
    msg,
  }
}

// unitTestActions()
async function unitTestActions() {
  await loadItems()
  await addItem(itemService.getEmptyItem())
  await updateItem({
    _id: 'm1oC7',
    title: 'Item-Good',
  })
  await removeItem('m1oC7')
  // TODO unit test addItemMsg
}
