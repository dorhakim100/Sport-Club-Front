import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Lottie from 'react-lottie'
import animationData from '/public/imgs/success.json'
import { showErrorMsg } from '../services/event-bus.service'
import { paymentService } from '../services/payment/payment.service'
import { loadUser } from '../store/actions/user.actions'
import { updateCart } from '../store/actions/user.actions'
import {
  SOCKET_EVENT_MAKE_ORDER,
  socketService,
} from '../services/socket.service'

export function SuccessPage() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  const [num, setNum] = useState(0)

  const [isDone, setIsDone] = useState(false)

  const location = useLocation()
  const { transactionId, amount } = location.state || {}

  const defaultOptions = {
    loop: false,
    autoplay: true, // Animation will autoplay
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  useEffect(() => {
    return () => {
      addPayment()
    }
  }, [])

  const addPayment = async () => {
    const url = location.search

    const params = new URLSearchParams(url)

    // Extract values from the URL
    const pelecardTransactionId = params.get('PelecardTransactionId')
    const userId = params.get('UserKey')
    const cartString = params.get('ParamX')

    // Check if the necessary parameters exist
    if (!pelecardTransactionId || !userId || !cartString) {
      showErrorMsg(
        prefs.isEnglish ? 'Missing required parameters' : 'חסרים פרמטרים דרושים'
      )
      return
    }

    // Parse the ParamX (items) string to an array
    let cart
    try {
      cart = JSON.parse(cartString)
    } catch (error) {
      showErrorMsg(
        prefs.isEnglish ? 'Invalid cart format' : 'פורמט פריטים לא תקין'
      )
      return
    }

    try {
      const payment = {
        userId,
        items: cart.items,
        pelecardTransactionId,
        amount: +cart.amount,
      }

      // Save the payment
      const savedOrder = await paymentService.save(payment)
      setNum(savedOrder.orderNum)
      socketService.emit(SOCKET_EVENT_MAKE_ORDER, payment)
      const savedUser = await loadUser(userId)
      console.log(savedUser)
      const newOrders = savedUser.ordersIds
      newOrders.push(savedOrder._id)
      // Update the cart after saving the payment
      updateCart({ ...savedUser, items: [], ordersIds: newOrders })
    } catch (err) {
      console.error(err)
      showErrorMsg(prefs.isEnglish ? 'There was an error' : 'הייתה תקלה')
    }
  }

  return (
    <div className='success-page'>
      <h1>{prefs.isEnglish ? `We got your order!` : `קיבלנו את ההזמנה!`}</h1>
      {/* <p>
        {prefs.isEnglish
          ? ` Your payment has been processed successfully.`
          : `התשלום עבר בהצלחה`}
      </p> */}
      <b>{prefs.isEnglish ? `Order Num: ${num}` : `מס׳ הזמנה: ${num}`}</b>
      <p>
        {prefs.isEnglish
          ? `One of our team will soon take care of it`
          : `אחד מאיתנו כבר מתחיל לטפל בה`}
      </p>

      <Lottie options={defaultOptions} height={200} width={200} />

      <button onClick={() => (window.location.href = '/')}>
        {prefs.isEnglish ? `Go to Home` : `מסך הבית`}
      </button>
    </div>
  )
}
