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

async function query(filterBy = { txt: '', price: 0 }) {
  var items = await storageService.query(STORAGE_KEY)
  const { txt, maxPrice, sortDir, types, pageIdx, isAll } = filterBy

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

  if (isAll) {
    return items
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
    const itemToSave = {
      _id: item._id,
      price: item.price,
      speed: item.speed,
    }
    savedItem = await storageService.put(STORAGE_KEY, itemToSave)
  } else {
    const itemToSave = {
      vendor: item.vendor,
      price: item.price,
      speed: item.speed,
      // Later, owner is set by the backend
      owner: userService.getLoggedinUser(),
      msgs: [],
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
    title: '',
    preview: '',
    type: '',
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
    },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
