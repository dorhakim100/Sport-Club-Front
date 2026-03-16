import { httpService } from '../http.service'

const KEY = 'slot'

export const slotService = {
  query,
  register,
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

function getDefaultFilter() {
  return {
    from: '',
    to: '',
  }
}
