import { classService } from '../../services/class/class.service'
import { store } from '../store'
import {
  SET_CLASSES,
  SET_CLASS,
  UPDATE_CLASS,
  ADD_CLASS,
  REMOVE_CLASS,
} from '../reducers/class.reducer'

export async function loadClasses(filterBy) {
  console.log(filterBy)
  try {
    const classes = await classService.query(filterBy)
    store.dispatch(getCmdSetClasses(classes))
    return classes
  } catch (err) {
    console.log('Cannot load classes', err)
    throw err
  }
}

export async function loadClass(classId) {
  try {
    console.log(classId)
    const clas = await classService.getById(classId)
    console.log(clas)
    store.dispatch(getCmdSetClass(clas))
    return clas
  } catch (err) {
    console.log('Cannot load class', err)
    throw err
  }
}

export async function removeClass(classId) {
  try {
    await classService.remove(classId)
    store.dispatch(getCmdRemoveClass(classId))
  } catch (err) {
    console.log('Cannot remove class', err)
    throw err
  }
}

export async function addClass(clas) {
  try {
    const savedClass = await classService.save(clas)
    store.dispatch(getCmdAddClass(savedClass))
    return savedClass
  } catch (err) {
    console.log('Cannot add class', err)
    throw err
  }
}

export async function updateClass(clas) {
  try {
    const savedClass = await classService.save(clas)
    store.dispatch(getCmdUpdateClass(savedTrainer))
    return savedClass
  } catch (err) {
    console.log('Cannot save class', err)
    throw err
  }
}

// Command Creators:
function getCmdSetClasses(classes) {
  return {
    type: SET_CLASSES,
    classes,
  }
}
function getCmdSetClass(clas) {
  return {
    type: SET_CLASS,
    clas,
  }
}
function getCmdRemoveClass(classId) {
  return {
    type: REMOVE_CLASS,
    classId,
  }
}
function getCmdAddClass(clas) {
  return {
    type: ADD_CLASS,
    clas,
  }
}
function getCmdUpdateClass(clas) {
  return {
    type: UPDATE_CLASS,
    clas,
  }
}

// unitTestActions()
async function unitTestActions() {
  await loadItems()
  await addItem(classService.getEmptyItem())
  await updateItem({
    _id: 'm1oC7',
    title: 'Item-Good',
  })
  await removeItem('m1oC7')
  // TODO unit test addItemMsg
}
