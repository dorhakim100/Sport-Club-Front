import { trainerService } from '../../services/trainer/trainer.service'
import { store } from '../store'
import {
  ADD_TRAINER,
  REMOVE_TRAINER,
  SET_TRAINERS,
  SET_TRAINER,
  UPDATE_TRAINER,
} from '../reducers/trainer.reducer'

export async function loadTrainers(filterBy) {
  try {
    const trainers = await trainerService.query(filterBy)
    store.dispatch(getCmdSetTrainers(trainers))
    return trainers
  } catch (err) {
    console.log('Cannot load trainers', err)
    throw err
  }
}

export async function loadTrainer(trainerId) {
  try {
    console.log(trainerId)
    const trainer = await trainerService.getById(trainerId)
    console.log(trainer)
    store.dispatch(getCmdSetTrainer(trainer))
    return trainer
  } catch (err) {
    console.log('Cannot load trainer', err)
    throw err
  }
}

export async function removeTrainer(trainerId) {
  try {
    await trainerService.remove(trainerId)
    store.dispatch(getCmdRemoveTrainer(trainerId))
  } catch (err) {
    console.log('Cannot remove trainer', err)
    throw err
  }
}

export async function addTrainer(trainer) {
  try {
    const savedTrainer = await trainerService.save(trainer)
    store.dispatch(getCmdAddTrainer(savedTrainer))
    return savedTrainer
  } catch (err) {
    console.log('Cannot add trainer', err)
    throw err
  }
}

export async function updateTrainer(trainer) {
  try {
    const savedTrainer = await trainerService.save(trainer)
    store.dispatch(getCmdUpdateTrainer(savedTrainer))
    return savedTrainer
  } catch (err) {
    console.log('Cannot save trainer', err)
    throw err
  }
}

// Command Creators:
function getCmdSetTrainers(trainers) {
  return {
    type: SET_TRAINERS,
    trainers,
  }
}
function getCmdSetTrainer(trainer) {
  return {
    type: SET_TRAINER,
    trainer,
  }
}
function getCmdRemoveTrainer(trainerId) {
  return {
    type: REMOVE_TRAINER,
    trainerId,
  }
}
function getCmdAddTrainer(trainer) {
  return {
    type: ADD_TRAINER,
    trainer,
  }
}
function getCmdUpdateTrainer(trainer) {
  return {
    type: UPDATE_TRAINER,
    trainer,
  }
}

// unitTestActions()
async function unitTestActions() {
  await loadItems()
  await addItem(trainerService.getEmptyItem())
  await updateItem({
    _id: 'm1oC7',
    title: 'Item-Good',
  })
  await removeItem('m1oC7')
  // TODO unit test addItemMsg
}
