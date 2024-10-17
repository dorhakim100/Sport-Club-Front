import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user/user.service'

const STORAGE_KEY = 'schedule'
const PAGE_SIZE = 6

export const scheduleService = {
  query,
  getById,
  save,
  remove,

  getMaxPage,
}

if (!localStorage.getItem(STORAGE_KEY)) {
  _createItems()
}

async function query(filterBy = { pageIdx: 0 }) {
  var schedules = await storageService.query(STORAGE_KEY)
  const { pageIdx, isAll } = filterBy
  if (isAll) {
    return schedules
  }

  if (pageIdx !== undefined) {
    const startIdx = pageIdx * PAGE_SIZE
    items = items.slice(startIdx, startIdx + PAGE_SIZE)
  }

  return schedules
}

function getById(scheduleId) {
  return storageService.get(STORAGE_KEY, scheduleId)
}

async function remove(scheduleId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, scheduleId)
}

async function save(scheduleLink) {
  var savedSchedule

  const scheduleToSave = {
    link: scheduleLink,
  }
  savedSchedule = await storageService.post(STORAGE_KEY, scheduleToSave)

  return savedSchedule
}

async function getMaxPage() {
  try {
    var items = await query({ isAll: true })
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
      link: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729158737/%D7%97%D7%95%D7%92%D7%99%D7%9D_%D7%97%D7%93%D7%A9_%D7%9E%D7%A2%D7%95%D7%93%D7%9B%D7%9F_8-2024-1_kceouw.png',
    },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
