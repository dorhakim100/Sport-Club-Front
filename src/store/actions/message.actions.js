import { messageService } from '../../services/message/message.service'
import { store } from '../store'
import {
  ADD_MESSAGE,
  SET_MESSAGE,
  SET_MESSAGES,
  REMOVE_MESSAGE,
} from '../reducers/message.reducer'

export async function loadMessages(filterBy) {
  console.log(filterBy)
  try {
    const messages = await messageService.query(filterBy)
    store.dispatch(getCmdSetMessages(messages))
    return messages
  } catch (err) {
    console.log('Cannot load messages', err)
    throw err
  }
}

export async function loadMessage(messageId) {
  try {
    console.log(messageId)
    const message = await messageService.getById(messageId)
    console.log(message)
    store.dispatch(getCmdSetMessage(message))
    return message
  } catch (err) {
    console.log('Cannot load message', err)
    throw err
  }
}

export async function removeMessage(messageId) {
  try {
    await messageService.remove(messageId)
    store.dispatch(getCmdRemoveMessage(messageId))
  } catch (err) {
    console.log('Cannot remove message', err)
    throw err
  }
}

export async function addMessage(message) {
  try {
    const savedMessage = await messageService.save(message)
    store.dispatch(getCmdAddMessage(savedMessage))
    return savedMessage
  } catch (err) {
    console.log('Cannot add message', err)
    throw err
  }
}

// Command Creators:
function getCmdSetMessages(messages) {
  return {
    type: SET_MESSAGES,
    messages,
  }
}
function getCmdSetMessage(message) {
  return {
    type: SET_MESSAGE,
    message,
  }
}
function getCmdRemoveMessage(messageId) {
  return {
    type: REMOVE_MESSAGE,
    messageId,
  }
}
function getCmdAddMessage(message) {
  return {
    type: ADD_MESSAGE,
    message,
  }
}

// unitTestActions()
async function unitTestActions() {
  await loadItems()
  await addItem(messageService.getEmptyItem())
  await updateItem({
    _id: 'm1oC7',
    title: 'Item-Good',
  })
  await removeItem('m1oC7')
  // TODO unit test addItemMsg
}
