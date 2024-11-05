import { httpService } from '../http.service'

const KEY = 'class'

export const classService = {
  query,
  getById,
  save,
  remove,
}

async function query(filterBy = { pageIdx: 0 }) {
  try {
    const res = await httpService.get(KEY, filterBy)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getById(classId) {
  try {
    const res = await httpService.get(`${KEY}/${classId}`)
    return res
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function remove(classId) {
  try {
    return await httpService.delete(`${KEY}/${classId}`)
  } catch (err) {
    console.log(err)
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
    console.log(err)
    throw err
  }
}
