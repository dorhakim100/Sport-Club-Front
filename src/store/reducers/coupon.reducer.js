import { couponService } from '../../services/coupon/coupon.service'

export const SET_COUPONS = 'SET_COUPONS'
export const SET_COUPON = 'SET_COUPON'
export const REMOVE_COUPON = 'REMOVE_COUPON'
export const ADD_COUPON = 'ADD_COUPON'
export const UPDATE_COUPON = 'UPDATE_COUPON'

const initialState = {
  coupons: [],
  coupon: couponService.getEmptyCoupon(),
}

export function couponReducer(state = initialState, action) {
  var newState = state
  var coupons
  switch (action.type) {
    case SET_COUPONS:
      newState = { ...state, coupons: action.coupons }
      break
    case SET_COUPON:
      console.log(action.coupon)
      newState = { ...state, coupon: action.coupon }
      break
    case REMOVE_COUPON:
      const lastRemovedItem = state.coupons.find(
        (coupon) => coupon._id === action.couponId
      )
      coupons = state.coupons.filter((coupon) => coupon._id !== action.couponId)
      newState = { ...state, coupons, lastRemovedItem }
      break
    case ADD_COUPON:
      newState = { ...state, coupons: [...state.coupons, action.coupon] }
      break
    case UPDATE_COUPON:
      coupons = state.coupons.map((coupon) =>
        coupon._id === action.coupon._id ? action.coupon : coupon
      )
      newState = { ...state, coupons }
      break

    default:
  }
  return newState
}
