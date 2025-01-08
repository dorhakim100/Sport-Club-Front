import { httpService } from '../http.service'
import { makeId } from '../util.service'
import { userService } from '../user/user.service'

const KEY = 'order'

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:3030/api/'
const BASE_ORDER_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:5173/'

export const orderService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getMaxPage,
  getEmptyOrder,
  createNewOrderLink,
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

async function createNewOrderLink(order) {
  if (!order?.amount || !order?._id) {
    throw new Error('Invalid order data: amount and id are required.')
  }

  try {
    const response = await fetch(`${BASE_URL}payment/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: order.amount,
        orderId: order._id,
        user: order.user,
        goodUrl: `${BASE_ORDER_URL}order/success`,
        badUrl: `${BASE_ORDER_URL}order/error`,
      }),
    })

    if (!response.ok) {
      const errorDetails = await response.json() // Try to parse error details if available
      throw new Error(
        `Payment initiation failed with status ${response.status}: ${
          errorDetails.error || response.statusText
        }`
      )
    }

    const result = await response.json()
    if (result.paymentUrl) {
      return result.paymentUrl
    } else {
      throw new Error(`Response did not contain a payment URL.`)
    }
  } catch (err) {
    console.error('An error occurred while creating the payment order:', err)
    throw err // Re-throw error for the caller to handle
  }
}

async function cancelOrderTransaction({ confirmationKey, uniqueKey, total }) {
  try {
    const response = await fetch('/api/payment/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmationKey, uniqueKey, total }),
    })

    if (!response.ok) {
      const errorDetails = await response.json()
      throw new Error(
        `Cancellation failed with status ${response.status}: ${
          errorDetails.error || response.statusText
        }`
      )
    }

    const result = await response.json()
    console.log('Cancellation successful:', result.message)
    return result.message
  } catch (err) {
    console.error('An error occurred while canceling the transaction:', err)
    throw err
  }
}
