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
  getDefaultFilter,
  saveLoggedinUser,
  getEmptyUser,
  getPrefs,
  setPrefs,
  getLoggedinCart,
  getCartItems,
  getRememberedUser,
}

async function getUsers(filter) {
  try {
    const users = await httpService.get(`user`, filter)
    return users
  } catch (err) {
    // console.log(err)
    throw err
  }
}

async function getById(userId) {
  try {
    const user = await httpService.get(`user/${userId}`)
    return user
  } catch (err) {
    // console.log(err)
    throw err
  }
}

async function remove(userId) {
  try {
    return await httpService.delete(`user/${userId}`)
  } catch (err) {
    // console.log(err)
    throw err
  }
}

async function update(user) {
  try {
    const { _id } = user
    const savedUser = await httpService.put(`user/${_id}`, user)
    // When admin updates other user's details, do not update loggedinUser
    // const loggedinUser = getLoggedinUser() // Might not work because its defined in the main service???
    // if (loggedinUser._id === user._id) saveLoggedinUser(savedUser)

    return saveLoggedinUser(savedUser)
  } catch (err) {
    // console.log(err)
    throw err
  }
}

async function login(userCred) {
  try {
    const user = await httpService.post('auth/login', userCred)

    if (user) {
      const saved = saveLoggedinUser(user)
      if (userCred.imgUrl) user.imgUrl = userCred.imgUrl
      return saved
    }
  } catch (err) {
    // console.log(err)
    throw err
  }
}

async function loginToken() {
  try {
    const user = await httpService.post('auth/verify-token')
    return user
  } catch (err) {
    // console.log(err)
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
    // console.log(err)
    throw err
  }
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  try {
    return await httpService.post('auth/logout')
  } catch (err) {
    // console.log(err)
    throw err
  }
}

async function getLoggedinUser() {
  try {
    const remembered = await getRememberedUser()

    if (remembered) {
      return saveLoggedinUser(remembered)
    } else {
      const logged = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
      )
      if (!logged) return

      const retrieved = await getById(logged._id)

      return saveLoggedinUser(retrieved)
    }
  } catch (err) {
    // console.log(err)
    throw err
  }
}

function saveLoggedinUser(user) {
  user = {
    _id: user._id,
    fullname: user.fullname,
    username: user.username,
    imgUrl: user.imgUrl,
    isAdmin: user.isAdmin,
    email: user.email,
    phone: user.phone,
    ordersIds: user.ordersIds,
    items: user.items,
    phone: user.phone,
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
    phone: '',
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    calledUserId: '',
    pageIdx: 0,
  }
}

function getPrefs() {
  const entityType = 'sport-club-pref'
  let prefs
  if (!localStorage.getItem(entityType)) {
    prefs = { isEnglish: false, isDarkMode: false, isFirstTime: true }
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
    const cartToReturn = cartItems.map((item) => {
      const integerQuantity = +item.quantity
      const foundItem = cart.find((itemToFind) => itemToFind.id === item.id)

      return {
        ...item,
        quantity: integerQuantity,
        options: foundItem.options,
      }
    })
    return cartToReturn
  } catch (err) {
    // console.log(err)
    throw err
  }
}

async function getRememberedUser() {
  const sessionUser = JSON.parse(
    sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER)
  )

  try {
    // if (sessionUser) {
    //   const retrievedUser = await getById(sessionUser._id)
    //   console.log(retrievedUser)

    //   return saveLoggedinUser(retrievedUser)
    // }
    const prefs = getPrefs()
    if (!prefs.user) return
    const userId = prefs.user._id ? prefs.user._id : null
    if (userId) {
      // const cred = {
      //   username: prefs.user.username,
      //   password: '',
      //   isRemembered: true,
      // }
      // const user = await login(cred)

      const user = await getById(userId)
      // const user = await loginToken()
      if (user) {
        return saveLoggedinUser(user)
      }
    } else {
      return null
    }
  } catch (err) {
    // console.log(err)
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
//     // console.log(err)
//   }
// }
