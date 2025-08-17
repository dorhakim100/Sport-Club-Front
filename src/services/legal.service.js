export const legalService = {
  getAcceptance,
  setAcceptance,
  isAccepted,
}

const STORAGE_KEY = 'legal_acceptances'

function _loadAll() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

function _saveAll(all) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch {
    // ignore storage errors
  }
}

function getAcceptance(policyKey) {
  const all = _loadAll()
  return all[policyKey] || { accepted: false, version: null, acceptedAt: null }
}

function setAcceptance(policyKey, version) {
  const all = _loadAll()
  all[policyKey] = {
    accepted: true,
    version,
    acceptedAt: new Date().toISOString(),
  }
  _saveAll(all)
}

function isAccepted(policyKey, currentVersion) {
  const acc = getAcceptance(policyKey)

  return acc.accepted && acc.version === currentVersion
}
