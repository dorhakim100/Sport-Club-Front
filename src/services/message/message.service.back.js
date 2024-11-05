import { httpService } from '../http.service'

const KEY = 'message'

export const messageService = {
  query,
  getById,
  save,
  remove,
}

async function query(filterBy = { pageIdx: 0, txt: '' }) {
  try {
    const res = await httpService.get(KEY, filterBy)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getById(messageId) {
  try {
    const res = await httpService.get(`${KEY}/${messageId}`)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function remove(messageId) {
  try {
    return await httpService.delete(`${KEY}/${messageId}`)
  } catch (err) {
    console.log(err)
    throw err
  }
}
async function save(message) {
  try {
    var savedMessage
    if (message._id) {
      savedMessage = await httpService.put(`${KEY}/${message._id}`, message)
    } else {
      savedMessage = await httpService.post(KEY, message)
    }
    return savedMessage
  } catch (err) {
    console.log(err)
    throw err
  }
}
