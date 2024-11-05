import { httpService } from '../http.service'

const KEY = 'item'

export const itemService = {
  query,
  getById,
  save,
  remove,
  addItemMsg,
}

async function query(
  filterBy = {
    txt: '',
    maxPrice: 0,
    sortDir: '',
    types: [],
    pageIdx: 0,
    isAll: false,
  }
) {
  try {
    const res = await httpService.get(KEY, filterBy)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getById(itemId) {
  try {
    const res = await httpService.get(`${KEY}/${itemId}`)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function remove(itemId) {
  try {
    return await httpService.delete(`${KEY}/${itemId}`)
  } catch (err) {
    console.log(err)
    throw err
  }
}
async function save(item) {
  try {
    var savedItem
    if (item._id) {
      savedItem = await httpService.put(`${KEY}/${item._id}`, item)
    } else {
      savedItem = await httpService.post(KEY, item)
    }
    return savedItem
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function addItemMsg(itemId, txt) {
  const savedMsg = await httpService.post(`${KEY}/${itemId}/msg`, { txt })
  return savedMsg
}
