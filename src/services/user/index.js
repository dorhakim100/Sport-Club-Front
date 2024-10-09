const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'

function getEmptyUser() {
  return {
    username: '',
    password: '',
    fullname: '',
    isAdmin: false,
    score: 100,
  }
}

function getPrefs() {
  const entityType = 'sport-club-pref'
  let prefs
  if (!localStorage.getItem(entityType)) {
    prefs = { isEnglish: false }
    localStorage.setItem(entityType, JSON.stringify(prefs))
  } else {
    prefs = JSON.parse(localStorage.getItem(entityType)) || { isEnglish: false }
  }

  return prefs
}

function setPrefs(prefs) {
  const entityType = 'sport-club-pref'
  localStorage.setItem(entityType, JSON.stringify(prefs))
}

const service = VITE_LOCAL === 'true' ? local : remote
export const userService = { ...service, getEmptyUser, getPrefs, setPrefs }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.userService = userService
