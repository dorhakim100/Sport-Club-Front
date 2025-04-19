import { httpService } from '../http.service'
import { makeId } from '../util.service'

const KEY = 'message'

export const messageService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getMaxPage,
  getEmptyMessage,
  getOpenMessages,
  removeBulk,
}

async function query(filterBy = { pageIdx: 0, txt: '' }) {
  try {
    const res = await httpService.get(KEY, filterBy)
    return res
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function getById(messageId, messageFilter) {
  try {
    const res = await httpService.get(`${KEY}/${messageId}`, messageFilter)
    return res
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function remove(messageId) {
  try {
    return await httpService.delete(`${KEY}/${messageId}`)
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function removeBulk(messageIds) {
  try {
    return await httpService.delete(`${KEY}/bulkDelete`, { data: messageIds })
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function save(message) {
  try {
    var savedMessage
    if (message._id) {
      savedMessage = await httpService.put(`${KEY}/${message._id}`, message)
    } else {
      message.isDone = false
      savedMessage = await httpService.post(KEY, message)
    }
    return savedMessage
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

function getDefaultFilter() {
  return { txt: '', pageIdx: 0, onlyDone: false, sortDir: '', iaAll: false }
}

async function getMaxPage(filter) {
  try {
    var maxPage = await query({ ...filter, isAll: true, isMax: true })

    return maxPage
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

function getEmptyMessage() {
  return {
    _id: makeId(),
    name: '',
    title: '',
    content: '',
    phone: '',
    createdAt: Date.now(),
  }
}

async function getOpenMessages() {
  try {
    // var messages = await storageService.query(STORAGE_KEY)

    // const unDone = messages.filter((message) => message.isDone === false)
    // return unDone.length
    const length = await httpService.get('message/openLength')
    return length
  } catch (err) {
    // // console.log(err)
    throw err
  }
}
