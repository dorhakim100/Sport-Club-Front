import { httpService } from '../http.service'
import { convertToDate, makeId } from '../util.service'

const KEY = 'class'

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

async function query(filterBy = { pageIdx: 0, txt: '' }) {
  try {
    const res = await httpService.get(KEY, filterBy)
    return res
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function getById(classId, filter) {
  try {
    const res = await httpService.get(`${KEY}/${classId}`, filter)
    return res
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function remove(classId) {
  try {
    return await httpService.delete(`${KEY}/${classId}`)
  } catch (err) {
    // console.log(err)
    throw err
  }
}
async function save(clas) {
  try {
    var savedCoupon
    if (clas._id) {
      savedCoupon = await httpService.put(`${KEY}/${clas._id}`, clas)
    } else {
      savedCoupon = await httpService.post(KEY, clas)
    }
    return savedCoupon
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function getMaxPage(filter) {
  const PAGE_SIZE = 6
  try {
    var classes = await query({ ...filter, isAll: true })

    let maxPage = classes.length / PAGE_SIZE

    maxPage = Math.ceil(maxPage)
    return maxPage
  } catch (err) {
    // // console.log(err)
  }
}

function getDefaultFilter() {
  return { types: [], txt: '', intensity: '', pageIdx: 0, iaAll: true }
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
    img: 'https://res.cloudinary.com/dnxi70mfs/image/upload/v1737376990/DALL_E_2025-01-20_14.42.49_-_Create_a_default_empty_profile_image_for_a_sports_studio_class_setting._The_image_should_feature_the_silhouette_of_a_group_of_adults_in_various_sports_cjx8y2.webp',
  }
}

async function getClassTrainer(clas) {
  // const trainers = []
  // console.log(clas)
  // clas.occurrences.forEach((occur) => {
  //   if (trainers.some((trainer) => trainer.id === occur.trainer.id)) return

  //   trainers.push(occur.trainer)
  // })
  // return trainers

  try {
    const classId = clas._id
    const res = await httpService.get(`${KEY}/${classId}/trainers`)
    return res
  } catch (err) {
    // // console.log(err)
    throw err
  }
}
async function getOccurrences(filter = { isAll: true }) {
  try {
    const res = await httpService.get('class/schedule', filter)
    return res

    // const classes = await query({ isAll: true })

    // const allOccurrences = []

    // classes.forEach((clas) => {
    //   clas.occurrences.map((occur) => {
    //     if (!occur.isActive) return
    //     occur.title = clas.title
    //     delete occur.time
    //     allOccurrences.push(occur)
    //   })
    // })
    // allOccurrences.sort((item1, item2) => {
    //   const from1 = convertToDate(item1.from)
    //   const from2 = convertToDate(item2.from)
    //   return from1 - from2
    // })
    // return allOccurrences
  } catch (err) {
    // // console.log(err)
    throw err
  }
}
