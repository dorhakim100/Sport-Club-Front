import { itemService } from '../../services/item/item.service'

export const SET_ITEMS = 'SET_ITEMS'
export const SET_ITEM = 'SET_ITEM'
export const REMOVE_ITEM = 'REMOVE_ITEM'
export const ADD_ITEM = 'ADD_ITEM'
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const ADD_ITEM_MSG = 'ADD_ITEM_MSG'
export const SET_ITEM_FILTER = 'SET_ITEM_FILTER'

const initialState = {
  items: [],
  item: itemService.getEmptyItem(),
  filter: itemService.getDefaultFilter(),
}

export function itemReducer(state = initialState, action) {
  var newState = state
  var items
  switch (action.type) {
    case SET_ITEMS:
      newState = { ...state, items: action.items }
      break
    case SET_ITEM:
      newState = { ...state, item: action.item }
      break
    case REMOVE_ITEM:
      const lastRemovedItem = state.items.find(
        (item) => item._id === action.itemId
      )
      items = state.items.filter((item) => item._id !== action.itemId)
      newState = { ...state, items, lastRemovedItem }
      break
    case ADD_ITEM:
      newState = { ...state, items: [...state.items, action.item] }
      break
    case UPDATE_ITEM:
      items = state.items.map((item) =>
        item._id === action.item._id ? action.item : item
      )
      newState = { ...state, items }
      break
    case ADD_ITEM_MSG:
      newState = {
        ...state,
        item: { ...state.item, msgs: [...(state.item.msgs || []), action.msg] },
      }
      break
    case SET_ITEM_FILTER:
      newState = { ...state, filter: action.filter }
    default:
  }
  return newState
}

// unitTestReducer()

function unitTestReducer() {
  var state = initialState
  const item1 = {
    _id: 'b101',
    vendor: 'Item ' + parseInt(Math.random() * 10),
    msgs: [],
  }
  const item2 = {
    _id: 'b102',
    vendor: 'Item ' + parseInt(Math.random() * 10),
    msgs: [],
  }

  state = itemReducer(state, { type: SET_ITEMS, items: [item1] })

  state = itemReducer(state, { type: ADD_ITEM, item: item2 })

  state = itemReducer(state, {
    type: UPDATE_ITEM,
    item: { ...item2, vendor: 'Good' },
  })

  state = itemReducer(state, { type: REMOVE_ITEM, itemId: item2._id })

  const msg = { id: 'm' + parseInt(Math.random() * 100), txt: 'Some msg' }
  state = itemReducer(state, { type: ADD_ITEM_MSG, itemId: item1._id, msg })

  state = itemReducer(state, { type: REMOVE_ITEM, itemId: item1._id })
}
