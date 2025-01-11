import { paymentService } from '../../services/payment/payment.service'
import { store } from '../store'
import {
  SET_PAYMENTS,
  SET_PAYMENT,
  UPDATE_PAYMENT,
  SET_OPEN_PAYMENTS,
} from '../reducers/payment.reducer'

export async function loadPayments(filterBy) {
  try {
    const payments = await paymentService.query(filterBy)
    store.dispatch(getCmdSetPayments(payments))
    console.log(filterBy)

    return payments
  } catch (err) {
    console.log('Cannot load payments', err)
    throw err
  }
}

export async function updatePayment(payment) {
  try {
    const savedPayment = await paymentService.save(payment)

    store.dispatch(getCmdUpdatePayment(savedPayment))
    return savedPayment
  } catch (err) {
    console.log('Cannot save payment', err)
    throw err
  }
}

export async function loadOpenPayments() {
  try {
    const openPayments = await paymentService.getOpenOrders()

    store.dispatch({
      type: SET_OPEN_PAYMENTS,
      openLength: openPayments,
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}

// export async function loadPayment(paymentId, filter) {
//   try {
//     const payment = await paymentService.getById(paymentId, filter)
//     store.dispatch(getCmdSetClass(payment))
//     return payment
//   } catch (err) {
//     console.log('Cannot load payment', err)
//     throw err
//   }
// }

// export async function removeClass(paymentId) {
//   try {
//     await paymentService.remove(paymentId)
//     store.dispatch(getCmdRemoveClass(paymentId))
//   } catch (err) {
//     console.log('Cannot remove payment', err)
//     throw err
//   }
// }

// export async function addClass(payment) {
//   try {
//     const savedPayment = await paymentService.save(payment)
//     store.dispatch(getCmdAddClass(savedPayment))
//     return savedPayment
//   } catch (err) {
//     console.log('Cannot add payment', err)
//     throw err
//   }
// }

// Command Creators:
function getCmdSetPayments(payments) {
  return {
    type: SET_PAYMENTS,
    payments,
  }
}
function getCmdSetPayment(payment) {
  return {
    type: SET_PAYMENT,
    payment,
  }
}
function getCmdRemovePayment(paymentId) {
  return {
    type: REMOVE_PAYMENT,
    paymentId,
  }
}
function getCmdAddPayment(payment) {
  return {
    type: ADD_PAYMENT,
    payment,
  }
}
function getCmdUpdatePayment(payment) {
  return {
    type: UPDATE_PAYMENT,
    payment,
  }
}

// unitTestActions()
async function unitTestActions() {
  await loadItems()
  await addItem(paymentService.getEmptyItem())
  await updateItem({
    _id: 'm1oC7',
    title: 'Item-Good',
  })
  await removeItem('m1oC7')
  // TODO unit test addItemMsg
}
