import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'

const STORAGE_KEY = 'message'
const PAGE_SIZE = 6

if (!localStorage.getItem(STORAGE_KEY)) {
  _createMessages()
}

export const messageService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getMaxPage,
  getEmptyMessage,
}

async function query(filterBy = { pageIdx: 0, txt: '' }) {
  var messages = await storageService.query(STORAGE_KEY)
  const { pageIdx, txt, onlyDone, sortDir } = filterBy
  if (filterBy.isAll) {
    return messages
  }

  if (txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    messages = messages.filter(
      (message) =>
        regex.test(message.name) ||
        regex.test(message.title) ||
        regex.test(message.content) ||
        regex.test(message.phone)
    )
  }

  if (onlyDone) {
    const unDone = messages.filter((message) => message.isDone === false)
    const doneMessages = messages.filter((message) => message.isDone === true)
    messages = [...unDone, ...doneMessages] // "fusing" both arrays using spread
  }

  if (sortDir) {
    messages.sort(
      (item1, item2) => (item1.createdAt - item2.createdAt) * +sortDir
    )
  }

  if (pageIdx !== undefined) {
    const startIdx = pageIdx * PAGE_SIZE
    messages = messages.slice(startIdx, startIdx + PAGE_SIZE)
  }

  return messages
}

function getById(messageId) {
  return storageService.get(STORAGE_KEY, messageId)
}

async function remove(messageId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, messageId)
}

async function save(message) {
  var savedMessage

  if (message._id) {
    const messageToSave = {
      _id: message._id,
      name: message.name,
      title: message.title,
      content: message.content,
      phone: message.content,
      createdAt: Date.now(),
      isDone: message.isDone,
    }
    savedMessage = await storageService.put(STORAGE_KEY, messageToSave)
  } else {
    const messageToSave = {
      name: message.name,
      title: message.title,
      content: message.content,
      phone: message.content,
      createdAt: Date.now(),
    }

    savedMessage = await storageService.post(STORAGE_KEY, messageToSave)
  }

  return savedMessage
}

async function getMaxPage() {
  try {
    var messages = await query({ isAll: true })
    let maxPage = messages.length / PAGE_SIZE
    maxPage = Math.ceil(maxPage)
    return maxPage
  } catch (err) {
    console.log(err)
  }
}

function getDefaultFilter() {
  return { txt: '', pageIdx: 0, onlyDone: false, sortDir: '', iaAll: false }
}

function getEmptyMessage() {
  return {
    _id: makeId(),
    title: '',
    content: '',
    phone: '',
    createdAt: Date.now(),
  }
}

function _createMessages() {
  const messages = [
    {
      _id: makeId(),
      title: 'בקשה למידע נוסף',
      content: 'האם אפשר לקבל מידע נוסף על השירותים שלכם ועלויות המנוי?',
      createdAt: Date.now() - 3600000, // לפני שעה
      phone: '052-1234567',
      isDone: false,
      name: 'יוסי כהן',
    },
    {
      _id: makeId(),
      title: 'בעיה באתר',
      content: 'אני מתקשה להיכנס לחשבון שלי באתר. אשמח לעזרה.',
      createdAt: Date.now() - 7200000, // לפני שעתיים
      phone: '054-9876543',
      isDone: true,
      name: 'רותם לוי',
    },
    {
      _id: makeId(),
      title: 'פידבק על פעילות',
      content: 'נהניתי מאוד מהאימון האחרון, אבל יש לי כמה הצעות לשיפור.',
      createdAt: Date.now() - 10800000, // לפני שלוש שעות
      phone: '050-4567890',
      isDone: true,
      name: 'נועה גבע',
    },
    {
      _id: makeId(),
      title: 'שאלת חיוב',
      content: 'יש לי שאלה לגבי החשבונית האחרונה שלי. תוכלו לעזור?',
      createdAt: Date.now() - 14400000, // לפני ארבע שעות
      phone: '052-3332211',
      isDone: false,
      name: 'עמית ברק',
    },
    {
      _id: makeId(),
      title: 'הצעת שיתוף פעולה',
      content:
        'אנחנו מעוניינים לשתף פעולה עם המועדון שלכם. נשמח אם תיצרו איתנו קשר.',
      createdAt: Date.now() - 18000000, // לפני חמש שעות
      phone: '053-9998877',
      isDone: false,
      name: 'שיר בנימין',
    },
    {
      _id: makeId(),
      title: 'בקשה להצטרפות לקבוצה',
      content: 'אשמח לדעת אם יש מקום בקבוצת האימון שלכם להצטרף כמנוי חדש.',
      createdAt: Date.now() - 21600000, // לפני שש שעות
      phone: '054-1122334',
      isDone: false,
      name: 'אופיר חן',
    },
    {
      _id: makeId(),
      title: 'תלונה על מתקנים',
      content: 'שמים לב שהמקלחות במועדון זקוקות לניקוי. אפשר לטפל בזה?',
      createdAt: Date.now() - 25200000, // לפני שבע שעות
      phone: '050-6677889',
      isDone: true,
      name: 'ליאור זיתוני',
    },
    {
      _id: makeId(),
      title: 'שאלה על שעות פתיחה',
      content: 'האם המועדון פתוח גם בסופי שבוע? אשמח לדעת.',
      createdAt: Date.now() - 28800000, // לפני שמונה שעות
      phone: '052-2244668',
      isDone: false,
      name: 'דניאל נעמי',
    },
    {
      _id: makeId(),
      title: 'בקשה לאימון אישי',
      content: 'אני מעוניין באימון אישי במועדון. אפשר לקבל מידע על כך?',
      createdAt: Date.now() - 32400000, // לפני תשע שעות
      phone: '054-4455667',
      isDone: false,
      name: 'איילה אשר',
    },
    {
      _id: makeId(),
      title: 'הצעה לשיפור אתר',
      content:
        'האתר מאוד נוח לשימוש, אך כדאי להוסיף אפשרות לקבוע אימונים דרך האתר.',
      createdAt: Date.now() - 36000000, // לפני עשר שעות
      phone: '050-7788990',
      isDone: false,
      name: 'מתן קרני',
    },
  ]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}
