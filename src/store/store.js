import { legacy_createStore as createStore, combineReducers } from 'redux'

import { itemReducer } from './reducers/item.reducer'
import { userReducer } from './reducers/user.reducer'
import { updateReducer } from './reducers/update.reducer'
import { systemReducer } from './reducers/system.reducer'
import { trainerReducer } from './reducers/trainer.reducer.js'
import { messageReducer } from './reducers/message.reducer.js'
import { classReducer } from './reducers/class.reducer.js'
import { couponReducer } from './reducers/coupon.reducer.js'
import { paymentReducer } from './reducers/payment.reducer'

const rootReducer = combineReducers({
  itemModule: itemReducer,
  userModule: userReducer,
  systemModule: systemReducer,
  updateModule: updateReducer,
  trainerModule: trainerReducer,
  messageModule: messageReducer,
  classModule: classReducer,
  couponModule: couponReducer,
  paymentModule: paymentReducer,
})

const middleware = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
  : undefined
export const store = createStore(rootReducer, middleware)

// For debug:
// store.subscribe(() => {
//     console.log('**** Store state changed: ****')
//     console.log('storeState:\n', store.getState())
//     console.log('*******************************')
// })
