import { messageService } from '../../services/message/message.service'

export const SET_MESSAGES = 'SET_MESSAGES'
export const SET_MESSAGE = 'SET_MESSAGE'
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE'
export const ADD_MESSAGE = 'ADD_MESSAGE'
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE'
export const SET_OPEN_MESSAGES = 'SET_OPEN_MESSAGES'
export const REMOVE_MESSAGES = 'REMOVE_MESSAGES'

const initialState = {
  messages: [],
  message: messageService.getEmptyMessage(),
  openLength: 0,
  bulkIds: [],
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
    case REMOVE_MESSAGES:
      const idsToExclude = action.bulkIds
      const newMessages = state.messages.filter(
        (message) => !idsToExclude.includes(message._id)
      )

      // Update the state with the filtered messages
      newState = { ...state, messages: newMessages }
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
    case UPDATE_MESSAGE:
      newState = {
        ...state,
        message: action.message,
        openLength: action.openLength,
      }

    case SET_OPEN_MESSAGES:
      newState = { ...state, openLength: action.openLength }
      break
    default:
  }
  return newState
}
