import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user/user.service'

const STORAGE_KEY = 'trainer'
const PAGE_SIZE = 6

export const trainerService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getMaxPage,
  getEmptyTrainer,
}

if (!localStorage.getItem(STORAGE_KEY)) {
  _createTrainers()
}

async function query(filterBy = { pageIdx: 0, types: [] }) {
  var trainers = await storageService.query(STORAGE_KEY)
  const { pageIdx, types } = filterBy
  if (filterBy.isAll) {
    return trainers
  }

  if (types.length > 0) {
    trainers = trainers.filter((trainer) =>
      types.some((type) => trainer.types.includes(type))
    )
  }
  if (pageIdx !== undefined) {
    const startIdx = pageIdx * PAGE_SIZE
    trainers = trainers.slice(startIdx, startIdx + PAGE_SIZE)
  }

  return trainers
}

function getById(trainerId) {
  return storageService.get(STORAGE_KEY, trainerId)
}

async function remove(trainerId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, trainerId)
}

async function save(trainer) {
  var savedTrainer

  if (trainer._id) {
    const trainerToSave = {
      _id: trainer._id,
      name: { he: trainer.name.he, eng: trainer.name.eng },
      types: trainer.types,
      img: trainer.img,
      preview: { he: trainer.preview.he, eng: trainer.preview.eng },
      description: {
        he: '',
        eng: '',
      },
      experience: trainer.experience,
    }
    savedTrainer = await storageService.put(STORAGE_KEY, trainerToSave)
  } else {
    const trainerToSave = {
      name: { he: trainer.name.he, eng: trainer.name.eng },
      types: trainer.types,
      img: trainer.img,
      preview: { he: trainer.preview.he, eng: trainer.preview.eng },
      description: {
        he: '',
        eng: '',
      },
      experience: trainer.experience,
    }

    savedTrainer = await storageService.post(STORAGE_KEY, trainerToSave)
  }

  return savedTrainer
}

async function getMaxPage() {
  try {
    var trainers = await query({ isAll: true })
    let maxPage = trainers.length / PAGE_SIZE
    maxPage = Math.ceil(maxPage)
    return maxPage
  } catch (err) {
    console.log(err)
  }
}

function getDefaultFilter() {
  return { types: [], pageIdx: 0, iaAll: true }
}

function getEmptyTrainer() {
  return {
    _id: makeId(),
    name: { he: '', eng: '' },
    types: [],
    img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1730047839/blank-profile-picture-973460_1280_jidp6j.webp',
    preview: {
      he: '',
      eng: '',
    },
    experience: '01-01-2000',
  }
}

function _createTrainers() {
  let trainerId = 0
  const trainers = [
    {
      _id: trainerId++,
      name: { he: 'שביט אביטל', eng: 'Shavit Avital' },
      types: ['gym', 'studio'],
      img: 'https://sb.kaleidousercontent.com/67418/1672x1018/6463a5af0d/screenshot-2022-05-24-at-15-22-28.png',
      preview: {
        he: 'האני מאמין שלי בכל מה שקשור לאימונים',
        eng: 'I believe the most important thing in this training world is',
      },
      experience: '01-01-2005',
    },
    {
      _id: trainerId++,
      name: { he: 'נועה כהן', eng: 'Noa Cohen' },
      types: ['studio', 'yoga'],
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn9zilY2Yu2hc19pDZFxgWDTUDy5DId7ITqA&s',
      preview: {
        he: 'שיטה המשלבת תרגילי כוח ואירובי',
        eng: 'A method combining strength and aerobic exercises',
      },
      experience: '15-06-2010',
    },
    {
      _id: trainerId++,
      name: { he: 'רן לוי', eng: 'Ran Levi' },
      types: ['gym', 'yoga'],
      img: 'https://sb.kaleidousercontent.com/67418/1920x1545/c5f15ac173/samuel-raita-ridxdghg7pw-unsplash.jpg',
      preview: {
        he: 'יוגה כשגרת חיים בריאה ואיזון נפשי',
        eng: 'Yoga as a healthy lifestyle and mental balance',
      },
      experience: '10-09-2008',
    },
    {
      _id: trainerId++,
      name: { he: 'מירב בן דוד', eng: 'Mirev Ben David' },
      types: ['gym', 'studio'],
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqCLdOQljlb1LPXcGyeXJbUcWm9UYIgcnvbA&s',
      preview: {
        he: 'תנועה בשילוב מוזיקה ככלי לביטוי עצמי',
        eng: 'Movement with music as a tool for self-expression',
      },
      experience: '22-03-2012',
    },
    {
      _id: trainerId++,
      name: { he: 'איתי קפלן', eng: 'Itay Kaplan' },
      types: ['gym', 'yoga', 'studio'],
      img: 'https://storage.googleapis.com/support-forums-api/avatar/profile-63011905-5200827860822575448.png',
      preview: {
        he: 'קרוספיט כאורח חיים לאתגר מתמיד',
        eng: 'Crossfit as a lifestyle for constant challenge',
      },
      experience: '05-11-2015',
    },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trainers))
}
