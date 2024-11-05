import { httpService } from '../http.service'

const KEY = 'update'

export const updateService = {
  query,
  getById,
  save,
  remove,
}

async function query(filterBy = { pageIdx: 0 }) {
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
