import { httpService } from '../http.service'

const KEY = 'slot'

export const slotService = {
  query,
  register,
  getDefaultFilter,
}

async function query(filterBy = getDefaultFilter()) {
  return await httpService.get(KEY, filterBy)
}

async function register(slotId, registrationData = {}) {
  return await httpService.put(`${KEY}/${slotId}/register`, registrationData)
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
