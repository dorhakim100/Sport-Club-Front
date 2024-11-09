import { httpService } from '../http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

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
  try {
    const users = await httpService.get(`user`)
    return users
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function getById(userId) {
  try {
    const user = await httpService.get(`user/${userId}`)
    return user
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function remove(userId) {
  try {
    return await httpService.delete(`user/${userId}`)
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function update({ _id, score }) {
  try {
    const user = await httpService.put(`user/${_id}`, { _id, score })

    // When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser() // Might not work because its defined in the main service???
    if (loggedinUser._id === user._id) saveLoggedinUser(user)

    return user
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function login(userCred) {
  try {
    const user = await httpService.post('auth/login', userCred)
    if (user) return saveLoggedinUser(user)
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function signup(userCred) {
  try {
    if (!userCred.imgUrl)
      userCred.imgUrl =
        'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    userCred.score = 10000

    userCred.ordersIds = []
    if (!userCred.items) userCred.items = []

    const user = await httpService.post('auth/signup', userCred)
    return saveLoggedinUser(user)
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  try {
    return await httpService.post('auth/logout')
  } catch (err) {
    console.log(err)
    throw err
  }
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

  return cart
}

async function getCartItems(cart) {
  try {
    const cartItems = await httpService.get(`item/cart`, cart)
    return cartItems
  } catch (err) {
    console.log(err)
    throw err
  }
}

// async function getCartItems(cart) {
//   try {
//     let items = await itemService.query({ isAll: true })
//     const itemsToReturn = []
//     let idx = 0
//     cart.map((item) => {
//       const currItem = items.find((itemToFind) => itemToFind._id === item.id)
//       if (currItem) {
//         itemsToReturn[idx] = {
//           id: currItem._id,
//           cover: currItem.cover,
//           price: currItem.price,
//           title: currItem.title,
//           quantity: item.quantity,
//         }
//         idx++
//       }
//     })

//     return itemsToReturn
//   } catch (err) {
//     console.log(err)
//   }
// }
