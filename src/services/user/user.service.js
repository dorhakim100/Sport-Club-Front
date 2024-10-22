import { storageService } from '../async-storage.service'
import { itemService } from '../item/item.service'

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
  getLoggedinCart,
  getCartItems,
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

async function update(userToUpdate) {
  const { _id } = userToUpdate
  const user = await storageService.get('user', _id)

  const savedUser = await storageService.put('user', userToUpdate)

  // When admin updates other user's details, do not update loggedinUser
  const loggedinUser = getLoggedinUser()
  if (loggedinUser._id === user._id) saveLoggedinUser(userToUpdate)

  return savedUser
}

async function login(userCred) {
  try {
    // console.log(userCred)
    const users = await storageService.query('user')
    // console.log(users)
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

  userCred.ordersIds = []
  if (!userCred.items) userCred.items = []

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
    username: user.username,
    imgUrl: user.imgUrl,
    isAdmin: user.isAdmin,
    email: user.email,
    ordersIds: user.ordersIds,
    items: user.items,
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
    ordersIds: [],
    items: [],
    email: '',
  }
}

function getPrefs() {
  const entityType = 'sport-club-pref'
  let prefs
  if (!localStorage.getItem(entityType)) {
    prefs = { isEnglish: false, isDarkMode: false }
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

function getLoggedinCart() {
  const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
  if (!user) return []
  const cart = user.items
  console.log(cart)
  return cart
}

async function getCartItems(cart) {
  try {
    let items = await itemService.query({ isAll: true })
    const itemsToReturn = []
    let idx = 0
    cart.map((item) => {
      const currItem = items.find((itemToFind) => itemToFind._id === item.id)
      if (currItem) {
        itemsToReturn[idx] = {
          id: currItem._id,
          cover: currItem.cover,
          price: currItem.price,
          title: currItem.title,
          quantity: item.quantity,
        }
        idx++
      }
    })

    return itemsToReturn
  } catch (err) {
    console.log(err)
  }
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
    items: [],
  }

  const newUser = await storageService.post('user', userCred)
  console.log('newUser: ', newUser)
}
