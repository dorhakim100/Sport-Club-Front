import { storageService } from '../async-storage.service'
import { convertToDate, makeId } from '../util.service'

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
  getClassTrainer,
  getOccurrences,
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
    const clas = {
      _id: classToSave._id,
      title: { he: classToSave.title.he, eng: classToSave.title.eng },
      img: classToSave.img,
      preview: { he: classToSave.preview.he, eng: classToSave.preview.eng },
      description: {
        he: classToSave.description.he,
        eng: classToSave.description.eng,
      },
      trainers: classToSave.trainers,
      intensity: classToSave.intensity,
      occurrences: classToSave.occurrences,
    }
    savedClass = await storageService.put(STORAGE_KEY, clas)
  } else {
    const clas = {
      title: { he: classToSave.title.he, eng: classToSave.title.eng },
      img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1729010361/cropping_j9auka.webp',
      preview: { he: classToSave.preview.he, eng: classToSave.preview.eng },
      description: {
        he: classToSave.description.he,
        eng: classToSave.description.eng,
      },
      trainers: classToSave.trainers,
      intensity: classToSave.intensity,
      occurrences: classToSave.occurrences,
    }

    savedClass = await storageService.post(STORAGE_KEY, clas)
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
    title: { he: '', eng: '' },
    description: {
      he: '',
      eng: '',
    },
    preview: {
      he: '',
      eng: '',
    },
    intensity: 1,
    occurrences: [],
  }
}

function getClassTrainer(clas) {
  const trainers = []
  console.log(clas)
  clas.occurrences.forEach((occur) => {
    if (trainers.some((trainer) => trainer.id === occur.trainer.id)) return

    trainers.push(occur.trainer)
  })
  return trainers
}
async function getOccurrences() {
  try {
    const classes = await query({ isAll: true })

    const allOccurrences = []

    classes.forEach((clas) => {
      clas.occurrences.map((occur) => {
        if (!occur.isActive) return
        occur.title = clas.title
        delete occur.time
        allOccurrences.push(occur)
      })
    })
    allOccurrences.sort((item1, item2) => {
      const from1 = convertToDate(item1.from)
      const from2 = convertToDate(item2.from)
      return from1 - from2
    })
    return allOccurrences
  } catch (err) {
    console.log(err)
    throw err
  }
}

function _createClass() {
  const classes = [
    {
      _id: makeId(),
      title: { he: 'יוגה', eng: 'Yoga' },
      preview: { he: 'יוגה לגוף ולנפש', eng: 'Yoga for self care' },
      description: {
        he: 'יוגה היא פעילות גופנית המשלבת תרגילים פיזיים, נשימות ומודעות עצמית. השיעור מתאים לכל הרמות ומספק רגע של רוגע והתחברות פנימית תוך שיפור גמישות הגוף והחוזק.',
        eng: 'Yoga is a practice that combines physical exercises, breathing, and self-awareness. Suitable for all levels, this class provides a moment of calm and inner connection, improving flexibility and strength.',
      },
      intensity: 3,
      occurrences: [
        {
          id: makeId(),
          day: 'sunday',
          from: '08:30',
          to: '10:00',
          trainer: {
            id: '0',
            name: { he: 'שביט אביטל', eng: 'Shavit Avital' },
          },
        },
        {
          id: makeId(),
          day: 'monday',
          from: '17:45',
          to: '19:00',
          trainer: { id: '1', name: { he: 'נועה כהן', eng: 'Noa Cohen' } },
        },
        {
          id: makeId(),
          day: 'tuesday',
          from: '07:00',
          to: '08:15',
          trainer: { id: '4', name: { he: 'איתי קפלן', eng: 'Itay Kaplan' } },
        },
        {
          id: makeId(),
          day: 'thursday',
          from: '17:45',
          to: '19:00',
          trainer: { id: '2', name: { he: 'רן לוי', eng: 'Ran Levy' } },
        },
      ],
      img: 'https://www.auromere.com/images/Yoga-Pastel-Sun-FB.jpg',
    },
    {
      _id: makeId(),
      title: { he: 'פילאטיס', eng: 'Pilates' },
      preview: {
        he: 'פילאטיס לחיזוק הגוף',
        eng: 'Pilates for body strengthening',
      },
      description: {
        he: 'פילאטיס הוא אימון המתמקד בחיזוק הגוף, שיפור היציבות ושמירה על גמישות. מתאים לכל הרמות ומסייע בהגברת המודעות לגוף ובשיפור שיווי המשקל.',
        eng: 'Pilates focuses on strengthening the body, improving stability, and maintaining flexibility. Suitable for all levels, it enhances body awareness and balance.',
      },
      intensity: 4,
      occurrences: [
        {
          id: makeId(),
          day: 'sunday',
          from: '08:30',
          to: '10:00',
          trainer: { id: '2', name: { he: 'רן לוי', eng: 'Ran Levy' } },
        },
        {
          id: makeId(),
          day: 'monday',
          from: '17:45',
          to: '19:00',
          trainer: { id: '1', name: { he: 'נועה כהן', eng: 'Noa Cohen' } },
        },
        {
          id: makeId(),
          day: 'tuesday',
          from: '07:00',
          to: '08:15',
          trainer: { id: '4', name: { he: 'איתי קפלן', eng: 'Itay Kaplan' } },
        },
        {
          id: makeId(),
          day: 'thursday',
          from: '17:45',
          to: '19:00',
          trainer: {
            id: '0',
            name: { he: 'שביט אביטל', eng: 'Shavit Avital' },
          },
        },
      ],
      img: 'https://media.self.com/photos/628e481b77d608f44f5f5abe/4:3/w_2560%2Cc_limit/what-is-pilates.jpeg',
    },
    {
      _id: makeId(),
      title: { he: 'קרוספיט', eng: 'Crossfit' },
      preview: {
        he: 'אימון אינטנסיבי לחיזוק השרירים',
        eng: 'Intensive workout for muscle building',
      },
      description: {
        he: 'קרוספיט הוא אימון מאתגר המתמקד בחיזוק השרירים ושיפור הכושר הכללי. השיעור כולל תרגילים מגוונים בתנאים אינטנסיביים ומיועד למתאמנים מנוסים.',
        eng: 'Crossfit is a challenging workout focused on muscle building and general fitness improvement. The class includes diverse exercises under intense conditions, suited for experienced trainees.',
      },
      intensity: 5,
      occurrences: [
        {
          id: makeId(),
          day: 'monday',
          from: '18:00',
          to: '19:00',
          trainer: {
            id: '1',
            name: { he: 'מירב בן דוד', eng: 'Meirav Ben David' },
          },
        },
        {
          id: makeId(),
          day: 'wednesday',
          from: '19:00',
          to: '20:00',
          trainer: {
            id: '1',
            name: { he: 'מירב בן דוד', eng: 'Meirav Ben David' },
          },
        },
      ],
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ-8usgopg9FLBs8wzDXGFKIW0qVXMdnn7tA&s',
    },
    {
      _id: makeId(),
      title: { he: 'מדיטציה', eng: 'Meditation' },
      preview: { he: 'מדיטציה להרגעת הנפש', eng: 'Meditation for relaxation' },
      description: {
        he: 'מדיטציה היא דרך להירגע ולהתמקד, המשלבת טכניקות נשימה ומודעות עצמית כדי להגיע לשקט פנימי ורגיעה עמוקה.',
        eng: 'Meditation is a method of relaxation and focus, using breathing techniques and self-awareness to achieve inner peace and deep relaxation.',
      },
      intensity: 1,
      occurrences: [
        {
          id: makeId(),
          day: 'friday',
          from: '10:00',
          to: '11:00',
          trainer: {
            id: '0',
            name: { he: 'שביט אביטל', eng: 'Shavit Avital' },
          },
        },
      ],
      img: 'https://www.everydayyoga.com/cdn/shop/articles/yoga_1024x1024.jpg?v=1703853908',
    },
    {
      _id: makeId(),
      title: { he: 'זומבה', eng: 'Zumba' },
      preview: {
        he: 'ריקודים לחיזוק הגוף ותחושת כיף',
        eng: 'Dance to strengthen the body and have fun',
      },
      description: {
        he: 'זומבה הוא אימון דינמי המשלב ריקודים מוזיקליים שונים, המסייע לחיזוק הגוף ושיפור הכושר, תוך הנאה מתנועות מהירות ומהנות.',
        eng: 'Zumba is a dynamic workout combining various musical dances, helping to strengthen the body and improve fitness while enjoying fast, fun movements.',
      },
      intensity: 3,
      occurrences: [
        {
          id: makeId(),
          day: 'tuesday',
          from: '18:00',
          to: '18:45',
          trainer: {
            id: '1',
            name: { he: 'מירב בן דוד', eng: 'Meirav Ben David' },
          },
        },
        {
          id: makeId(),
          day: 'friday',
          from: '08:00',
          to: '08:45',
          trainer: {
            id: '1',
            name: { he: 'מירב בן דוד', eng: 'Meirav Ben David' },
          },
        },
      ],
      img: 'https://cdn-magazine.nutrabay.com/wp-content/uploads/2024/04/workout-scene-fitness-enthusiasts-diving-deep-into-intense-training-bathed-dynamic-lighting-scaled.jpg',
    },
    {
      _id: makeId(),
      title: { he: 'אימון מחזורי', eng: 'Circuit Training' },
      preview: {
        he: 'אימון סיבולת וכוח',
        eng: 'Endurance and strength workout',
      },
      description: {
        he: 'אימון מחזורי מתמקד בבניית סיבולת וכוח באמצעות תרגילים מגוונים ברצף מהיר. השיעור מתאים לשיפור הכושר והגברת החוסן הפיזי.',
        eng: 'Circuit training focuses on building endurance and strength through a sequence of diverse exercises in quick succession. Suitable for enhancing fitness and increasing physical resilience.',
      },
      intensity: 4,
      occurrences: [
        {
          id: makeId(),
          day: 'wednesday',
          from: '17:30',
          to: '19:00',
          trainer: { id: '2', name: { he: 'רן לוי', eng: 'Ran Levy' } },
        },
        {
          id: makeId(),
          day: 'thursday',
          from: '18:00',
          to: '19:00',
          trainer: {
            id: '0',
            name: { he: 'שביט אביטל', eng: 'Shavit Avital' },
          },
        },
      ],
      img: 'https://www.verywellfit.com/thmb/WU2Q6YXCHqH1wOGQ-0VszY9hQ2E=/700x0/filters:no_upscale%2Cwidth:700%2Cquality:90/116847794_10157508417356505_3381621275269782033_o-bcc4ff1e5a57474389cb433c6760ff5e.jpg',
    },
  ]

  const updatedClasses = classes.map((classItem) => {
    return {
      ...classItem,
      occurrences: classItem.occurrences.map((occurrence) => ({
        ...occurrence,
        isActive: true,
      })),
    }
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClasses))
}

// trainers: [
//   {
//     name: { he: 'לולי', eng: 'Loli' },
//     id: makeId(),
//   },
//   {
//     name: { he: 'מירב', eng: 'Meirav' },
//     id: makeId(),
//   },
// ],
