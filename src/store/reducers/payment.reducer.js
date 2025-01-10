import { paymentService } from '../../services/payment/payment.service'

export const SET_PAYMENTS = 'SET_PAYMENTS'
export const SET_PAYMENT = 'SET_PAYMENT'
export const REMOVE_PAYMENT = 'REMOVE_PAYMENT'
export const UPDATE_PAYMENT = 'UPDATE_PAYMENT'

const initialState = {
  payments: [],
  payment: paymentService.getEmptyOrder(),
}

export function paymentReducer(state = initialState, action) {
  var newState = state
  var payments
  switch (action.type) {
    case SET_PAYMENTS:
      newState = { ...state, payments: action.payments }
      break
    case SET_PAYMENT:
      newState = { ...state, payment: action.payment }
      break
    case REMOVE_PAYMENT:
      const lastRemovedItem = state.payments.find(
        (payment) => payment._id === action.couponId
      )
      payments = state.payments.filter(
        (payment) => payment._id !== action.couponId
      )
      newState = { ...state, payments, lastRemovedItem }
      break

    case UPDATE_PAYMENT:
      payments = state.payments.map((payment) =>
        payment._id === action.payment._id ? action.payment : payment
      )
      newState = { ...state, payments }
      break

    default:
  }
  return newState
}
