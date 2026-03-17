import { httpService } from '../http.service'

const KEY = 'slot'

export const slotService = {
  query,
  register,
  updateSlot,
  getDefaultFilter,
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
  }
}
