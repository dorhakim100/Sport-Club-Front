import { httpService } from '../http.service'

const KEY = 'trainer'

export const trainerService = {
  query,
  getById,
  save,
  remove,
}

async function query(filterBy = { pageIdx: 0, types: [] }) {
  try {
    const res = await httpService.get(KEY, filterBy)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getById(trainerId) {
  try {
    const res = await httpService.get(`${KEY}/${trainerId}`)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function remove(trainerId) {
  try {
    return await httpService.delete(`${KEY}/${trainerId}`)
  } catch (err) {
    console.log(err)
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
    console.log(err)
    throw err
  }
}
