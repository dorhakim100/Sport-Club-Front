import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'item'

export const itemService = {
  query,
  getById,
  save,
  remove,
  addItemMsg,
  getEmptyItem,
  getDefaultFilter,
}
window.cs = itemService

if (!localStorage.getItem(STORAGE_KEY)) {
  _createItems()
}

async function query(filterBy = { txt: '', price: 0 }) {
  var items = await storageService.query(STORAGE_KEY)
  const { txt, maxPrice, sortField, sortDir } = filterBy

  if (txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    items = items.filter(
      (item) => regex.test(item.vendor) || regex.test(item.description)
    )
  }
  if (maxPrice) {
    items = items.filter((item) => item.price <= maxPrice)
  }

  if (sortField === 'price' || sortField === 'title') {
    items.sort(
      (item1, item2) => (item1[sortField] - item2[sortField]) * +sortDir
    )
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
    sortField: '',
    sortDir: '',
    type: [],
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
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
