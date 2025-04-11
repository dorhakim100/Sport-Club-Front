import { httpService } from '../http.service'
import { makeId } from '../util.service'

const KEY = 'opening'

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:3030/api/'
const BASE_ORDER_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:5173/'

export const openingService = {
  query,
  save,
}

async function query() {
  try {
    const res = await httpService.get(KEY)

    return res
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function save(newTimes) {
  try {
    const updatedTimes = await httpService.put(`${KEY}`, newTimes)
    return updatedTimes
  } catch (err) {
    // // console.log(err)
    throw err
  }
}
