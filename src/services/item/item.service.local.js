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
}
window.cs = itemService

async function query(filterBy = { txt: '', price: 0 }) {
  var items = await storageService.query(STORAGE_KEY)
  const { txt, minSpeed, maxPrice, sortField, sortDir } = filterBy

  if (txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    items = items.filter(
      (item) => regex.test(item.vendor) || regex.test(item.description)
    )
  }
  if (minSpeed) {
    items = items.filter((item) => item.speed >= minSpeed)
  }
  if (sortField === 'vendor' || sortField === 'owner') {
    items.sort(
      (item1, item2) =>
        item1[sortField].localeCompare(item2[sortField]) * +sortDir
    )
  }
  if (sortField === 'price' || sortField === 'speed') {
    items.sort(
      (item1, item2) => (item1[sortField] - item2[sortField]) * +sortDir
    )
  }

  items = items.map(({ _id, vendor, price, speed, owner }) => ({
    _id,
    vendor,
    price,
    speed,
    owner,
  }))
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
