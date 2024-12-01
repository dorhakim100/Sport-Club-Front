import { trainerService } from '../../services/trainer/trainer.service'

export const SET_TRAINERS = 'SET_TRAINERS'
export const SET_TRAINER = 'SET_TRAINER'
export const REMOVE_TRAINER = 'REMOVE_TRAINER'
export const ADD_TRAINER = 'ADD_TRAINER'
export const UPDATE_TRAINER = 'UPDATE_TRAINER'
export const SET_TRAINER_FILTER = 'SET_TRAINER_FILTER'

const initialState = {
  trainers: [],
  trainer: trainerService.getEmptyTrainer(),
  filter: trainerService.getDefaultFilter(),
}

export function trainerReducer(state = initialState, action) {
  var newState = state
  var trainers
  switch (action.type) {
    case SET_TRAINERS:
      newState = { ...state, trainers: action.trainers }
      break
    case SET_TRAINER:
      newState = { ...state, trainer: action.trainer }
      break
    case REMOVE_TRAINER:
      const lastRemovedItem = state.trainers.find(
        (trainer) => trainer._id === action.trainerId
      )
      trainers = state.trainers.filter(
        (trainer) => trainer._id !== action.trainerId
      )
      newState = { ...state, trainers, lastRemovedItem }
      break
    case ADD_TRAINER:
      newState = { ...state, trainers: [...state.trainers, action.trainer] }
      break
    case UPDATE_TRAINER:
      trainers = state.trainers.map((trainer) =>
        trainer._id === action.trainer._id ? action.trainer : trainer
      )
      newState = { ...state, trainers }
      break

    case SET_TRAINER_FILTER:
      newState = { ...state, filter: action.filter }

    default:
  }
  return newState
}
