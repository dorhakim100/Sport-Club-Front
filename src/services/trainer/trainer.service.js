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

  getMaxPage,
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

  if (pageIdx !== undefined) {
    const startIdx = pageIdx * PAGE_SIZE
    trainers = trainers.slice(startIdx, startIdx + PAGE_SIZE)
  }

  if (types.length > 0) {
    trainers = trainers.filter((trainer) =>
      types.some((type) => trainer.types.includes(type))
    )
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
      name: trainer.name,
      types: trainer.types,
      img: trainer.img,
      preview: trainer.preview,
      experience: trainer.experience,
    }
    savedTrainer = await storageService.put(STORAGE_KEY, trainerToSave)
  } else {
    const trainerToSave = {
      name: trainer.name,
      types: trainer.types,
      img: trainer.img,
      preview: trainer.preview,
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

function _createTrainers() {
  const trainers = [
    {
      _id: makeId(),
      name: { he: 'שביט אביטל', eng: 'Shavit Avital' },
      types: ['gym', 'studio'],
      img: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      preview: {
        he: 'האני מאמין שלי בכל מה שקשור לאימונים',
        eng: 'I believe the most important thing in this training world is',
      },
      experience: '01-01-2005',
    },
    {
      _id: makeId(),
      name: { he: 'נועה כהן', eng: 'Noa Cohen' },
      types: ['studio', 'yoga'],
      img: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      preview: {
        he: 'שיטה המשלבת תרגילי כוח ואירובי',
        eng: 'A method combining strength and aerobic exercises',
      },
      experience: '15-06-2010',
    },
    {
      _id: makeId(),
      name: { he: 'רן לוי', eng: 'Ran Levi' },
      types: ['gym', 'yoga'],
      img: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      preview: {
        he: 'יוגה כשגרת חיים בריאה ואיזון נפשי',
        eng: 'Yoga as a healthy lifestyle and mental balance',
      },
      experience: '10-09-2008',
    },
    {
      _id: makeId(),
      name: { he: 'מירב בן דוד', eng: 'Mirev Ben David' },
      types: ['gym', 'studio'],
      img: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      preview: {
        he: 'תנועה בשילוב מוזיקה ככלי לביטוי עצמי',
        eng: 'Movement with music as a tool for self-expression',
      },
      experience: '22-03-2012',
    },
    {
      _id: makeId(),
      name: { he: 'איתי קפלן', eng: 'Itay Kaplan' },
      types: ['gym', 'yoga', 'studio'],
      img: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      preview: {
        he: 'קרוספיט כאורח חיים לאתגר מתמיד',
        eng: 'Crossfit as a lifestyle for constant challenge',
      },
      experience: '05-11-2015',
    },
  ]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trainers))
}
