import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user/user.service'

const STORAGE_KEY = 'update'
const PAGE_SIZE = 6

export const updateService = {
  query,
  getById,
  save,
  remove,

  getMaxPage,
}

if (!localStorage.getItem(STORAGE_KEY)) {
  _createUpdates()
}

async function query(filterBy = { pageIdx: 0 }) {
  var updates = await storageService.query(STORAGE_KEY)
  const { pageIdx, isAll } = filterBy
  if (isAll) {
    return updates
  }

  if (pageIdx !== undefined) {
    const startIdx = pageIdx * PAGE_SIZE
    updates = updates.slice(startIdx, startIdx + PAGE_SIZE)
  }

  return updates
}

function getById(updateId) {
  return storageService.get(STORAGE_KEY, updateId)
}

async function remove(updateId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, updateId)
}

async function save(update) {
  var savedSchedule
  let updateToSave

  if (update._id) {
    updateToSave = {
      _id: update._id,
      title: update.title,
      content: update.content,
      createdAt: Date.now(),
    }

    savedSchedule = await storageService.put(STORAGE_KEY, updateToSave)
  } else {
    updateToSave = {
      title: update.title,
      content: update.content,
      createdAt: Date.now(),
    }

    savedSchedule = await storageService.post(STORAGE_KEY, updateToSave)
  }

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

function _createUpdates() {
  const updates = [
    {
      _id: makeId(),
      title: 'שעות פתיחה בחג',
      content:
        'המועדון יפעל במתכונת שונה בהתאם לחגים, יש להתעדכן בשעות הפתיחה עם משרד המועדון',
      createdAt: Date.now() - 100000000, // example timestamp
    },
    {
      _id: makeId(),
      title: 'אירוע טורניר כדורגל',
      content:
        'טורניר כדורגל מקומי יתקיים ביום שישי הקרוב. ההרשמה נפתחה באתר, נא להירשם מראש.',
      createdAt: Date.now() - 50000000, // example timestamp
    },
    {
      _id: makeId(),
      title: 'חוג יוגה חדש למתחילים',
      content:
        'נפתח חוג יוגה חדש למתחילים כל יום ראשון ורביעי בשעה 19:00. הרשמה דרך האפליקציה.',
      createdAt: Date.now() - 20000000, // example timestamp
    },
    {
      _id: makeId(),
      title: 'מבצע מנויים',
      content:
        'מבצע מיוחד למנויים חדשים בחודש הקרוב. הנחה של 20% על כל סוגי המנויים.',
      createdAt: Date.now() - 10000000, // example timestamp
    },
    {
      _id: makeId(),
      title: 'שינוי במערכת השעות',
      content:
        'שינויים זמניים במערכת החוגים לשבוע הקרוב. יש להתעדכן באתר או באפליקציה.',
      createdAt: Date.now() - 5000000, // example timestamp
    },
    {
      _id: makeId(),
      title: 'סדנת תזונה ספורטיבית',
      content:
        'ביום חמישי הקרוב תתקיים סדנת תזונה ספורטיבית עם מומחה. מספר המקומות מוגבל.',
      createdAt: Date.now() - 2000000, // example timestamp
    },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updates))
}
