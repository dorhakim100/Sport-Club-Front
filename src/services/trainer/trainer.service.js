import { httpService } from '../http.service'
import { makeId } from '../util.service'
import { userService } from '../user/user.service'

const KEY = 'trainer'

export const trainerService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getMaxPage,
  getEmptyTrainer,
}

async function query(filterBy = { pageIdx: 0, types: [] }) {
  try {
    const res = await httpService.get(KEY, filterBy)
    return res
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function getById(trainerId, trainerFilter) {
  try {
    const res = await httpService.get(`${KEY}/${trainerId}`, trainerFilter)
    return res
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

async function remove(trainerId) {
  try {
    return await httpService.delete(`${KEY}/${trainerId}`)
  } catch (err) {
    // // console.log(err)
    throw err
  }
}
async function save(trainer) {
  try {
    var savedTrainer
    if (trainer._id) {
      savedTrainer = await httpService.put(`${KEY}/${trainer._id}`, trainer)
    } else {
      savedTrainer = await httpService.post(KEY, trainer)
    }
    return savedTrainer
  } catch (err) {
    // // console.log(err)
    throw err
  }
}

function getDefaultFilter() {
  return { types: [], pageIdx: 0, iaAll: true }
}

async function getMaxPage() {
  try {
    var trainers = await query({ isAll: true })
    let maxPage = trainers.length / PAGE_SIZE
    maxPage = Math.ceil(maxPage)
    return maxPage
  } catch (err) {
    // // console.log(err)
  }
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
