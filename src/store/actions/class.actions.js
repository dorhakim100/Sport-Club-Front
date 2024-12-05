import { classService } from '../../services/class/class.service'
import { store } from '../store'
import {
  SET_CLASSES,
  SET_CLASS,
  UPDATE_CLASS,
  ADD_CLASS,
  REMOVE_CLASS,
  SET_CLASS_FILTER,
} from '../reducers/class.reducer'

export async function loadClasses(filterBy) {
  try {
    const classes = await classService.query(filterBy)
    store.dispatch(getCmdSetClasses(classes))
    console.log(filterBy)
    store.dispatch({
      type: SET_CLASS_FILTER,
      filter: filterBy,
    })
    return classes
  } catch (err) {
    console.log('Cannot load classes', err)
    throw err
  }
}

export async function loadClass(classId, filter) {
  try {
    const clas = await classService.getById(classId, filter)
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

    store.dispatch(getCmdUpdateClass(savedClass))
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
