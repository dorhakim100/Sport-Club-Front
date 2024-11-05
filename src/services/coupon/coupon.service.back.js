import { httpService } from '../http.service'

const KEY = 'coupon'

export const couponService = {
  query,
  getById,
  save,
  remove,
}

async function query(filterBy = { pageIdx: 0, txt: '' }) {
  try {
    const res = await httpService.get(KEY, filterBy)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getById(couponId) {
  try {
    const res = await httpService.get(`${KEY}/${couponId}`)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function remove(couponId) {
  try {
    return await httpService.delete(`${KEY}/${couponId}`)
  } catch (err) {
    console.log(err)
    throw err
  }
}
async function save(coupon) {
  try {
    var savedCoupon
    if (coupon._id) {
      savedCoupon = await httpService.put(`${KEY}/${coupon._id}`, coupon)
    } else {
      savedCoupon = await httpService.post(KEY, coupon)
    }
    return savedCoupon
  } catch (err) {
    console.log(err)
    throw err
  }
}
