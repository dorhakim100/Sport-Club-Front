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
    console.log(filterBy)
    const items = await httpService.get(KEY, filterBy)
    console.log(items)
    return items
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

function getEmptyItem() {
  return {
    _id: makeId(),
    price: '',
    title: { he: '', eng: '' },
    preview: { he: '', eng: '' },
    types: [],
    cover: '',
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
  const PAGE_SIZE = 6

  try {
    var items = await query({ ...filterBy, isAll: true })

    let maxPage = items.length / PAGE_SIZE
    maxPage = Math.ceil(maxPage)
    return maxPage
  } catch (err) {
    console.log(err)
  }
}
