import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user/user.service'

const STORAGE_KEY = 'item'
const PAGE_SIZE = 6

export const itemService = {
  query,
  getById,
  save,
  remove,
  addItemMsg,
  getEmptyItem,
  getDefaultFilter,
  getMaxPage,
}
window.cs = itemService

if (!localStorage.getItem(STORAGE_KEY)) {
  _createItems()
}

async function query(filterBy = { txt: '', price: 0, types: [] }) {
  var items = await storageService.query(STORAGE_KEY)
  const { txt, maxPrice, sortDir, types, pageIdx, isAll } = filterBy

  if (isAll) {
    return items
  }

  if (txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    items = items.filter(
      (item) =>
        regex.test(item.title.he) ||
        regex.test(item.title.eng) ||
        regex.test(item.description.he) ||
        regex.test(item.description.eng)
    )
  }
  if (maxPrice) {
    items = items.filter((item) => item.price <= maxPrice)
  }

  if (types.length > 0) {
    items = items.filter((item) =>
      types.some((type) => item.types.includes(type))
    )
  }

  if (sortDir) {
    items.sort((item1, item2) => (item1.price - item2.price) * +sortDir)
  }

  if (pageIdx !== undefined) {
    const startIdx = pageIdx * PAGE_SIZE
    items = items.slice(startIdx, startIdx + PAGE_SIZE)
  }

  return items
}

function getById(itemId) {
  return storageService.get(STORAGE_KEY, itemId)
}

async function remove(itemId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, itemId)
}

async function save(item) {
  var savedItem
  if (item._id) {
    console.log(item)
    const itemToSave = {
      _id: item._id,
      cover: item.cover,
      preview: item.preview,
      price: item.price,
      stockQuantity: item.stockQuantity,
      title: item.title,
      types: item.types,
    }
    savedItem = await storageService.put(STORAGE_KEY, itemToSave)
  } else {
    const itemToSave = {
      cover:
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729010361/cropping_j9auka.webp',
      preview: item.preview,
      price: item.price,
      stockQuantity: item.stockQuantity,
      title: item.title,
      types: [],
    }
    savedItem = await storageService.post(STORAGE_KEY, itemToSave)
  }
  return savedItem
}

async function addItemMsg(itemId, txt) {
  // Later, this is all done by the backend
  const item = await getById(itemId)

  const msg = {
    id: makeId(),
    by: userService.getLoggedinUser(),
    txt,
  }
  item.msgs.push(msg)
  await storageService.put(STORAGE_KEY, item)

  return msg
}

function getEmptyItem() {
  return {
    _id: makeId(),
    price: '',
    title: { he: '', eng: '' },
    preview: { he: '', eng: '' },
    types: [],
    cover: '',
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    maxPrice: '',
    sortDir: '',
    types: [],
    pageIdx: 0,
  }
}

async function getMaxPage(filterBy) {
  try {
    var items = await query({ ...filterBy, isAll: true })
    let maxPage = items.length / PAGE_SIZE
    maxPage = Math.ceil(maxPage)
    return maxPage
  } catch (err) {
    console.log(err)
  }
}

function _createItems() {
  const items = [
    {
      _id: makeId(),
      title: {
        he: 'כרטיסייה - כל השבוע',
        eng: '12 Passes - All Week',
      },
      preview: {
        he: '12 ביקורים במחיר מוזל',
        eng: 'Visit us 12 times, discount price',
      },
      price: 800,
      types: ['card'],
      stockQuantity: true,
      cover:
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002831/picture_mz9ke7.jpg',
    },
    {
      _id: makeId(),
      title: {
        he: 'כרטיסייה - אמצע השבוע',
        eng: '12 Passes - Sunday-Thursday',
      },
      preview: {
        he: '12 ביקורים במחיר מוזל',
        eng: 'Visit us 12 times, discount price',
      },
      price: 600,
      types: ['card'],
      stockQuantity: true,
      cover:
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002473/20_rjsrgf.jpg',
    },
    {
      _id: makeId(),
      title: {
        he: 'כרטיסייה אמהות הרצלייניות - כל השבוע',
        eng: '12 Passes - All Week',
      },
      preview: {
        he: '12 ביקורים במחיר מוזל',
        eng: 'Visit us 12 times, discount price',
      },
      price: 720,
      types: ['card'],
      stockQuantity: true,
      cover:
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002513/34_gdwu4o.jpg',
    },
    {
      _id: makeId(),
      title: {
        he: 'כרטיסייה אמהות הרצלייניות - אמצע השבוע',
        eng: '12 Passes - Sunday-Thursday',
      },
      preview: {
        he: '12 ביקורים במחיר מוזל',
        eng: 'Visit us 12 times, discount price',
      },
      price: 520,
      types: ['card'],
      stockQuantity: true,
      cover:
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002495/32_peuixp.jpg',
    },
    {
      _id: makeId(),
      title: {
        he: 'כובע ים',
        eng: 'Swimming Cap',
      },
      preview: {
        he: 'מתאים למבוגרים ולילדים',
        eng: 'Suits adults and children',
      },
      price: 20,
      types: ['accessories'],
      stockQuantity: 30,
      cover:
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002558/HPIM0594_g0hqlu.jpg',
    },
    {
      _id: makeId(),
      title: {
        he: 'משקפת שחייה',
        eng: 'Swimming Goggles',
      },
      preview: {
        he: 'מתאים למבוגרים ולילדים',
        eng: 'Suits adults and children',
      },
      price: 40,
      types: ['accessories'],
      stockQuantity: 25,
      cover:
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002533/45_shdnag.jpg',
    },
    {
      _id: makeId(),
      title: {
        he: 'מצופים - 3-6',
        eng: 'Floats - 3-6',
      },
      preview: {
        he: 'מתאים לגילאי 3-6',
        eng: 'Suits children ages 3-6',
      },
      price: 40,
      types: ['accessories'],
      stockQuantity: 21,
      cover:
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002559/HPIM0347_vdpqdu.jpg',
    },
    {
      _id: makeId(),
      title: {
        he: 'מצופים - 6-12',
        eng: 'Floats - 6-12',
      },
      preview: {
        he: 'מתאים לגילאי 6-12',
        eng: 'Suits children ages 6-12',
      },
      price: 40,
      types: ['accessories'],
      stockQuantity: 13,
      cover:
        'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729002831/picture_mz9ke7.jpg',
    },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
