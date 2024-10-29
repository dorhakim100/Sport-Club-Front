import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user/user.service'

const STORAGE_KEY = 'class'
const PAGE_SIZE = 6

export const classService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getMaxPage,
  getEmptyClass,
}

if (!localStorage.getItem(STORAGE_KEY)) {
  _createClass()
}

async function query(filterBy = { pageIdx: 0 }) {
  var classes = await storageService.query(STORAGE_KEY)
  const { pageIdx } = filterBy
  if (filterBy.isAll) {
    return classes
  }

  if (pageIdx !== undefined) {
    const startIdx = pageIdx * PAGE_SIZE
    classes = classes.slice(startIdx, startIdx + PAGE_SIZE)
  }

  return classes
}

function getById(classId) {
  return storageService.get(STORAGE_KEY, classId)
}

async function remove(classId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, classId)
}

async function save(classToSave) {
  var savedClass

  if (classToSave._id) {
    const trainerToSave = {
      _id: classToSave._id,
      name: { he: classToSave.name.he, eng: classToSave.name.eng },
      img: classToSave.img,
      preview: { he: classToSave.preview.he, eng: classToSave.preview.eng },
      trainers: classToSave.trainers,
    }
    savedClass = await storageService.put(STORAGE_KEY, trainerToSave)
  } else {
    const trainerToSave = {
      name: { he: classToSave.name.he, eng: classToSave.name.eng },
      img: classToSave.img,
      preview: { he: classToSave.preview.he, eng: classToSave.preview.eng },
      trainers: classToSave.trainers,
    }

    savedClass = await storageService.post(STORAGE_KEY, trainerToSave)
  }

  return savedClass
}

async function getMaxPage() {
  try {
    var classes = await query({ isAll: true })
    let maxPage = classes.length / PAGE_SIZE
    maxPage = Math.ceil(maxPage)
    return maxPage
  } catch (err) {
    console.log(err)
  }
}

function getDefaultFilter() {
  return { types: [], pageIdx: 0, iaAll: true }
}

function getEmptyClass() {
  return {
    _id: makeId(),
    name: { he: '', eng: '' },
    preview: {
      he: '',
      eng: '',
    },
    intensity: 1,
    trainers: [],
  }
}

function _createClass() {
  const classes = [
    {
      _id: makeId(),
      title: { he: 'יוגה', eng: 'Yoga' },
      preview: { he: 'יוגה לגוף ולנפש', eng: 'Yoga for self care' },
      intensity: 3,
      trainers: [],
    },
    {
      _id: makeId(),
      title: { he: 'פילאטיס', eng: 'Pilates' },
      preview: {
        he: 'פילאטיס לחיזוק הגוף',
        eng: 'Pilates for body strengthening',
      },
      intensity: 4,
      trainers: [],
    },
    {
      _id: makeId(),
      title: { he: 'קרוספיט', eng: 'Crossfit' },
      preview: {
        he: 'אימון אינטנסיבי לחיזוק השרירים',
        eng: 'Intensive workout for muscle building',
      },
      intensity: 5,
      trainers: [],
    },
    {
      _id: makeId(),
      title: { he: 'מדיטציה', eng: 'Meditation' },
      preview: { he: 'מדיטציה להרגעת הנפש', eng: 'Meditation for relaxation' },
      intensity: 1,
      trainers: [],
    },
    {
      _id: makeId(),
      title: { he: 'זומבה', eng: 'Zumba' },
      preview: {
        he: 'ריקודים לחיזוק הגוף ותחושת כיף',
        eng: 'Dance to strengthen the body and have fun',
      },
      intensity: 3,
      trainers: [],
    },
    {
      _id: makeId(),
      title: { he: 'אימון מחזורי', eng: 'Circuit Training' },
      preview: {
        he: 'אימון סיבולת וכוח',
        eng: 'Endurance and strength workout',
      },
      intensity: 4,
      trainers: [],
    },
    {
      _id: makeId(),
      title: { he: 'ריצה', eng: 'Running' },
      preview: {
        he: 'שיפור כושר לב ריאה',
        eng: 'Improve cardiovascular fitness',
      },
      intensity: 3,
      trainers: [],
    },
  ]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes))
}
