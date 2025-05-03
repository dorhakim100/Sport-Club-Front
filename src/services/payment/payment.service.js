import { httpService } from '../http.service'
import { makeId } from '../util.service'
import { userService } from '../user/user.service'

const KEY = 'payment'

const PAGE_SIZE = 6

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:3030/api/'
const BASE_ORDER_URL =
  process.env.NODE_ENV === 'production' ? '/api/' : '//localhost:5173/'

export const paymentService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getMaxPage,
  getEmptyOrder,
  createNewOrderLink,
  getOpenOrders,
}

async function query(filterBy = { pageIdx: 0, types: [] }) {
  try {
    const res = await httpService.get(KEY, filterBy)

    return res
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function getById(orderId) {
  try {
    const res = await httpService.get(`${KEY}/${orderId}`)
    return res
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function remove(orderId) {
  try {
    return await httpService.delete(`${KEY}/${orderId}`)
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function save(payment) {
  try {
    var savedOrder
    if (payment._id) {
      savedOrder = await httpService.put(`${KEY}/${payment._id}`, payment)
    } else {
      savedOrder = await httpService.post(`${KEY}/add`, payment)
    }
    return savedOrder
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

function getDefaultFilter() {
  return {
    ordersIds: [],
    pageIdx: 0,
    iaAll: true,
    txt: '',
    onlyPending: false,
    sortDir: 1,
  }
}

async function getMaxPage(filter) {
  try {
    var maxPage = await query({ ...filter, isAll: true, isMax: true })
    // let maxPage = orders.length / PAGE_SIZE
    // maxPage = Math.ceil(maxPage)
    return maxPage
  } catch (err) {
    // // console.log(err)
  }
}

function getEmptyOrder() {
  return {
    _id: makeId(),
    user: { id: '' },
    items: [],
    amount: '',
    orderNum: '',
    isReady: false,
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
        items: order.items,
        coupon: order.coupon,
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
    return result.message
  } catch (err) {
    // console.error('An error occurred while canceling the transaction:', err)
    throw err
  }
}

async function getOpenOrders() {
  try {
    // var messages = await storageService.query(STORAGE_KEY)

    // const unDone = messages.filter((message) => message.isDone === false)
    // return unDone.length
    const length = await httpService.get('payment/openLength')
    return length
  } catch (err) {
    // // console.log(err)
    throw err
  }
}
