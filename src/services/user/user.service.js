import { storageService } from '../async-storage.service'

const STORAGE_KEY_LOGGEDIN_USER = 'user'

export const userService = {
  login,
  logout,
  signup,
  getUsers,
  getById,
  remove,
  update,
  getLoggedinUser,
  saveLoggedinUser,
  getEmptyUser,
  getPrefs,
  setPrefs,
}

async function getUsers() {
  const users = await storageService.query('user')
  return users.map((user) => {
    delete user.password
    return user
  })
}

async function getById(userId) {
  return await storageService.get('user', userId)
}

function remove(userId) {
  return storageService.remove('user', userId)
}

async function update({ _id, score }) {
  const user = await storageService.get('user', _id)
  user.score = score
  await storageService.put('user', user)

  // When admin updates other user's details, do not update loggedinUser
  const loggedinUser = getLoggedinUser()
  if (loggedinUser._id === user._id) saveLoggedinUser(user)

  return user
}

async function login(userCred) {
  try {
    console.log(userCred)
    const users = await storageService.query('user')
    console.log(users)
    const user = users.find((user) => user.username === userCred.username)

    if (user) return saveLoggedinUser(user)
  } catch (err) {
    console.log(err)
  }
}

async function signup(userCred) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
  userCred.score = 10000

  const user = await storageService.post('user', userCred)
  return saveLoggedinUser(user)
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
  user = {
    _id: user._id,
    fullname: user.fullname,
    imgUrl: user.imgUrl,
    score: user.score,
    isAdmin: user.isAdmin,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}

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

// To quickly create an admin user, uncomment the next line
// _createAdmin()
async function _createAdmin() {
  const userCred = {
    username: 'admin',
    password: 'admin123',
    fullname: 'Dor Hakim',
    imgUrl:
      'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
    isAdmin: true,
    email: 'service.kfar@gmail.com',
    ordersIds: [],
  }

  const newUser = await storageService.post('user', userCred)
  console.log('newUser: ', newUser)
}
