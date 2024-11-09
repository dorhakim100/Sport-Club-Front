import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'

const STORAGE_KEY = 'coupon'
const PAGE_SIZE = 6

if (!localStorage.getItem(STORAGE_KEY)) {
  _createCoupons()
}

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
  var coupons = await storageService.query(STORAGE_KEY)
  const { pageIdx, txt, amount, allActive } = filterBy
  if (filterBy.isAll) {
    return coupons
  }

  if (allActive) {
    coupons = coupons.filter((coupon) => coupon.isActive === true)
    return coupons
  }

  if (txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    coupons = coupons.filter(
      (coupon) =>
        regex.test(coupon.title.he) ||
        regex.test(coupon.title.eng) ||
        regex.test(coupon.code) ||
        regex.test(coupon.amount + '')
    )
  }

  if (pageIdx !== undefined) {
    const startIdx = pageIdx * PAGE_SIZE
    coupons = coupons.slice(startIdx, startIdx + PAGE_SIZE)
  }

  return coupons
}

function getById(couponId) {
  return storageService.get(STORAGE_KEY, couponId)
}

async function remove(couponId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, couponId)
}

async function save(coupon) {
  var savedCoupon

  if (coupon._id) {
    const couponToSave = {
      _id: coupon._id,
      title: coupon.title,
      code: coupon.code,
      amount: coupon.amount,
      isActive: coupon.isActive,
      type: coupon.type,
      items: coupon.items,
    }
    savedCoupon = await storageService.put(STORAGE_KEY, couponToSave)
  } else {
    const couponToSave = {
      title: coupon.title,
      code: coupon.code,
      amount: coupon.amount,
      isActive: coupon.isActive,
      type: coupon.type,
      items: coupon.items,
    }

    savedCoupon = await storageService.post(STORAGE_KEY, couponToSave)
  }

  return savedCoupon
}

async function getMaxPage() {
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
    const coupons = await query({ allActive: true })

    if (coupons.some((coupon) => coupon.code === couponCode)) {
      const coupon = coupons.find((coupon) => coupon.code === couponCode)

      return { amount: coupon.amount, type: coupon.type, items: coupon.items }
    } else {
      throw new Error(`Couldn't find coupon`)
    }
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

function _createCoupons() {
  const coupons = [
    {
      _id: makeId(),
      title: { he: 'אמהות הרצליה', eng: 'Herzeliya Moms' },
      code: 'MOMS80',
      amount: 80,
      type: 'fixed',
      isActive: true,
      items: [],
    },
    {
      _id: makeId(),
      title: { he: 'כרטיסיית אורחי מנוי', eng: `Member's card` },
      code: 'MEMBER500',
      amount: 300,
      isActive: false,
      type: 'fixed',
      items: [],
    },
    {
      _id: makeId(),
      title: { he: 'קיבוצים', eng: `Kibutzs` },
      code: 'KIBUTZ',
      amount: 10,
      type: 'percentage',
      isActive: true,
      items: [],
    },
  ]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons))
}
