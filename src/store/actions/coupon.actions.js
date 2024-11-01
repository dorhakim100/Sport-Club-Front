import { couponService } from '../../services/coupon/coupon.service'
import { store } from '../store'
import {
  SET_COUPON,
  SET_COUPONS,
  ADD_COUPON,
  REMOVE_COUPON,
  UPDATE_COUPON,
} from '../reducers/coupon.reducer'

export async function loadCoupons(filterBy) {
  try {
    const coupons = await couponService.query(filterBy)
    store.dispatch(getCmdSetCoupons(coupons))
    return coupons
  } catch (err) {
    console.log('Cannot load coupons', err)
    throw err
  }
}

export async function loadCoupon(couponId) {
  try {
    console.log(couponId)
    const coupon = await couponService.getById(couponId)
    console.log(coupon)
    store.dispatch(getCmdSetCoupon(coupon))
    return coupon
  } catch (err) {
    console.log('Cannot load coupon', err)
    throw err
  }
}

export async function removeCoupon(couponId) {
  try {
    await couponService.remove(couponId)
    store.dispatch(getCmdRemoveCoupon(couponId))
  } catch (err) {
    console.log('Cannot remove coupon', err)
    throw err
  }
}

export async function addCoupon(coupon) {
  try {
    const savedCoupon = await couponService.save(coupon)
    store.dispatch(getCmdAddCoupon(savedCoupon))
    return savedCoupon
  } catch (err) {
    console.log('Cannot add coupon', err)
    throw err
  }
}

export async function updateCoupon(coupon) {
  try {
    const savedCoupon = await couponService.save(coupon)
    store.dispatch(getCmdUpdateCoupon(savedCoupon))
    return savedCoupon
  } catch (err) {
    console.log('Cannot save coupon', err)
    throw err
  }
}

// Command Creators:
function getCmdSetCoupons(coupons) {
  return {
    type: SET_COUPONS,
    coupons,
  }
}
function getCmdSetCoupon(coupon) {
  return {
    type: SET_COUPON,
    coupon,
  }
}
function getCmdRemoveCoupon(couponId) {
  return {
    type: REMOVE_COUPON,
    couponId,
  }
}
function getCmdAddCoupon(coupon) {
  return {
    type: ADD_COUPON,
    coupon,
  }
}
function getCmdUpdateCoupon(coupon) {
  return {
    type: UPDATE_COUPON,
    coupon,
  }
}

// unitTestActions()
async function unitTestActions() {
  await loadItems()
  await addItem(couponService.getEmptyItem())
  await updateItem({
    _id: 'm1oC7',
    title: 'Item-Good',
  })
  await removeItem('m1oC7')
  // TODO unit test addItemMsg
}
