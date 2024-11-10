import { httpService } from '../http.service'
import { makeId } from '../util.service'

const KEY = 'coupon'

export const couponService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getMaxPage,
  getEmptyCoupon,
  getDiscount,
  createDiscount,
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

async function getMaxPage() {
  const PAGE_SIZE = 6
  try {
    var coupons = await query({ isAll: true })
    let maxPage = coupons.length / PAGE_SIZE
    maxPage = Math.ceil(maxPage)
    return maxPage
  } catch (err) {
    console.log(err)
  }
}

function getDefaultFilter() {
  return { txt: '', pageIdx: 0, amount: '', iaAll: false }
}

function getEmptyCoupon() {
  return {
    _id: makeId(),
    title: { he: '', eng: '' },
    code: '',
    isActive: true,
    amount: '',
    type: 'fixed',
    items: [],
  }
}

async function getDiscount(couponCode) {
  try {
    // const coupons = await query({ allActive: true })

    // if (coupons.some((coupon) => coupon.code === couponCode)) {
    //   const coupon = coupons.find((coupon) => coupon.code === couponCode)

    //   return { amount: coupon.amount, type: coupon.type, items: coupon.items }
    // } else {
    //   throw new Error(`Couldn't find coupon`)
    // }

    const res = await httpService.get('coupon/allActive', { code: couponCode })
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

function createDiscount(discount) {
  return {
    title: { he: 'הנחה', eng: 'Discount' },
    _id: makeId(),
    price: discount.amount,
    quantity: 1,
    cover:
      'https://res.cloudinary.com/dnxi70mfs/image/upload/v1730727611/discount-stamp-3_wgbcqd.png',
  }
}
