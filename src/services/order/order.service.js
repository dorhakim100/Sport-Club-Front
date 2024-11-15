import { httpService } from '../http.service'
import { makeId } from '../util.service'
import { userService } from '../user/user.service'

const KEY = 'order'

export const orderService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getMaxPage,
  getEmptyOrder,
}

async function query(filterBy = { pageIdx: 0, types: [] }) {
  try {
    const res = await httpService.get(KEY, filterBy)

    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getById(orderId) {
  try {
    const res = await httpService.get(`${KEY}/${orderId}`)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function remove(orderId) {
  try {
    return await httpService.delete(`${KEY}/${orderId}`)
  } catch (err) {
    console.log(err)
    throw err
  }
}
async function save(order) {
  try {
    var savedOrder
    if (order._id) {
      savedOrder = await httpService.put(`${KEY}/${order._id}`, order)
    } else {
      savedOrder = await httpService.post(KEY, order)
    }
    return savedOrder
  } catch (err) {
    console.log(err)
    throw err
  }
}

function getDefaultFilter() {
  return { types: [], pageIdx: 0, iaAll: true }
}

async function getMaxPage() {
  try {
    var orders = await query({ isAll: true })
    let maxPage = orders.length / PAGE_SIZE
    maxPage = Math.ceil(maxPage)
    return maxPage
  } catch (err) {
    console.log(err)
  }
}

function getEmptyOrder() {
  return {
    _id: makeId(),
    user: { id: '' },
    items: [],
    amount: '',

    createdAt: Date.now(),
  }
}
