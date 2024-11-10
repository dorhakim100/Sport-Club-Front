import { httpService } from '../http.service'

const KEY = 'update'

export const updateService = {
  query,
  getById,
  save,
  remove,
  getMaxPage,
  saveUpdatesOrder,
  getDefaultFilter,
}
async function query(filterBy = { pageIdx: 0, isAll: false }) {
  try {
    const res = await httpService.get(KEY, filterBy)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getById(updateId) {
  try {
    const res = await httpService.get(`${KEY}/${updateId}`)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function remove(updateId) {
  try {
    return await httpService.delete(`${KEY}/${updateId}`)
  } catch (err) {
    console.log(err)
    throw err
  }
}
async function save(update) {
  try {
    var savedUpdate
    if (update._id) {
      savedUpdate = await httpService.put(`${KEY}/${update._id}`, update)
    } else {
      savedUpdate = await httpService.post(KEY, update)
    }
    return savedUpdate
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getMaxPage() {
  const PAGE_SIZE = 6
  try {
    var items = await query({ isAll: true })
    let maxPage = items.length / PAGE_SIZE
    maxPage = Math.ceil(maxPage)
    console.log(maxPage)
    return maxPage
  } catch (err) {
    console.log(err)
  }
}

async function saveUpdatesOrder(updates) {
  try {
    console.log(updates)
    const res = await httpService.put(`${KEY}/reorder`, updates)
    console.log(res)
  } catch (err) {
    console.log(err)
    throw err
  }
}

function getDefaultFilter() {
  return { pageIdx: 0, isAll: false }
}
