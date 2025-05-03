import { httpService } from '../http.service'
import { makeId } from '../util.service'

const KEY = 'item'

export const itemService = {
  query,
  getById,
  save,
  remove,
  getEmptyItem,
  getDefaultFilter,
  getMaxPage,
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
    const items = await httpService.get(KEY, filterBy)

    return items
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function getById(itemId, filter) {
  try {
    const res = await httpService.get(`${KEY}/${itemId}`, filter)
    return res
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function remove(itemId) {
  try {
    return await httpService.delete(`${KEY}/${itemId}`)
  } catch (err) {
    // // console.log(err)
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
    // // console.log(err)
    throw err
  }
}

function getEmptyItem() {
  return {
    _id: makeId(),
    price: '',
    title: { he: '', eng: '' },
    preview: { he: '', eng: '' },
    types: [],
    imgs: [],
    optionIds: [],
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    maxPrice: '',
    sortDir: '',
    types: [],
    pageIdx: 0,
  }
}

async function getMaxPage(filterBy) {
  try {
    var maxPage = await query({ ...filterBy, isAll: true, isMax: true })

    return maxPage
  } catch (err) {
    // // console.log(err)
  }
}
