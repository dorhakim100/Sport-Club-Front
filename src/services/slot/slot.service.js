import { httpService } from '../http.service'

const KEY = 'slot'

export const slotService = {
  query,
  register,
  updateSlot,
  getDefaultFilter,
  getDatePaginationFilter,
}

async function query(filterBy = getDefaultFilter()) {
  try {
    return await httpService.get(KEY, filterBy)
  } catch (err) {
    throw err
  }
}

async function register(slotId, registrationData = {}) {
  try {
    return await httpService.put(`${KEY}/${slotId}/register`, registrationData)
  } catch (err) {
    throw err
  }
}

async function updateSlot(slot) {
  try {
    return await httpService.put(`${KEY}/${slot._id}`, slot)
  } catch (err) {
    throw err
  }
}

function getDefaultFilter() {
  const now = new Date()
  const from = new Date(now)
  from.setMinutes(0, 0, 0)

  // Keep a rolling 24h window from the closest relevant slot.
  const to = new Date(from)
  to.setHours(to.getHours() + 24)



  return {
    from: from.toISOString(),
    to: to.toISOString(),
    date: now.toISOString(),
  }
}

function getDatePaginationFilter(filterBy = getDefaultFilter(), diff = 1) {
  const normalizedDiff = diff === 1 || diff === -1 ? diff : 0
  if (!normalizedDiff) return { ...filterBy }

  const shiftedFilter = { ...filterBy }

  if (shiftedFilter.date) {
    const date = new Date(shiftedFilter.date)
    if (!Number.isNaN(date.getTime())) {
      date.setDate(date.getDate() + normalizedDiff)
      shiftedFilter.date = date.toISOString()
    }
  }

  // if (shiftedFilter.from) {
  //   const from = new Date(shiftedFilter.from)
  //   if (!Number.isNaN(from.getTime())) {
  //     from.setDate(from.getDate() + normalizedDiff)
  //     shiftedFilter.from = from.toISOString()
  //   }
  // }

  // if (shiftedFilter.to) {
  //   const to = new Date(shiftedFilter.to)
  //   if (!Number.isNaN(to.getTime())) {
  //     to.setDate(to.getDate() + normalizedDiff)
  //     shiftedFilter.to = to.toISOString()
  //   }
  // }

  return shiftedFilter
}
