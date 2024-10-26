import { messageService } from '../../services/message/message.service'

export const SET_MESSAGES = 'SET_MESSAGES'
export const SET_MESSAGE = 'SET_MESSAGE'
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE'
export const ADD_MESSAGE = 'ADD_MESSAGE'

const initialState = {
  messages: [],
  message: messageService.getEmptyMessage(),
}

export function messageReducer(state = initialState, action) {
  var newState = state
  var messages
  switch (action.type) {
    case SET_MESSAGES:
      newState = { ...state, messages: action.messages }
      break
    case SET_MESSAGE:
      newState = { ...state, message: action.message }
      break
    case REMOVE_MESSAGE:
      const lastRemovedItem = state.messages.find(
        (message) => message._id === action.itemId
      )
      messages = state.messages.filter(
        (message) => message._id !== action.itemId
      )
      newState = { ...state, messages, lastRemovedItem }
      break
    case ADD_MESSAGE:
      newState = { ...state, messages: [...state.messages, action.message] }
      break

    default:
  }
  return newState
}
