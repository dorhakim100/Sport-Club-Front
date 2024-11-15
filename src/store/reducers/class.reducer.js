import { classService } from '../../services/class/class.service'

export const SET_CLASSES = 'SET_CLASSES'
export const SET_CLASS = 'SET_CLASS'
export const REMOVE_CLASS = 'REMOVE_CLASS'
export const ADD_CLASS = 'ADD_CLASS'
export const UPDATE_CLASS = 'UPDATE_CLASS'

const initialState = {
  classes: [],
  class: classService.getEmptyClass(),
}

export function classReducer(state = initialState, action) {
  var newState = state
  var classes
  switch (action.type) {
    case SET_CLASSES:
      newState = { ...state, classes: action.classes }
      break
    case SET_CLASS:
      newState = { ...state, class: action.clas }
      break
    case REMOVE_CLASS:
      const lastRemovedItem = state.classes.find(
        (classToFind) => classToFind._id === action.itemId
      )
      classes = state.classes.filter(
        (classToFind) => classToFind._id !== action.itemId
      )
      newState = { ...state, classes, lastRemovedItem }
      break
    case ADD_CLASS:
      newState = { ...state, classes: [...state.classes, action.clas] }

      break
    case UPDATE_CLASS:
      classes = state.classes.map((classToMap) =>
        classToMap._id === action.clas._id ? action.clas : classToMap
      )
      newState = { ...state, classes }
      break

    default:
  }
  return newState
}
