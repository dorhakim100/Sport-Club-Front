import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Lottie from 'react-lottie'
import animationData from '/public/imgs/success.json'
import { showErrorMsg } from '../services/event-bus.service'
import { paymentService } from '../services/payment/payment.service'
import { setEmptyCart } from '../store/actions/user.actions'
import { updateCart } from '../store/actions/user.actions'

export function SuccessPage() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)

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
    console.log('called')
    const url = location.search

    const params = new URLSearchParams(url)

    // Extract values from the URL
    const pelecardTransactionId = params.get('PelecardTransactionId')
    const userId = params.get('UserKey')
    const itemsString = params.get('ParamX')

    // Check if the necessary parameters exist
    if (!pelecardTransactionId || !userId || !itemsString) {
      showErrorMsg(
        prefs.isEnglish ? 'Missing required parameters' : 'חסרים פרמטרים דרושים'
      )
      return
    }

    // Parse the ParamX (items) string to an array
    let items
    try {
      items = JSON.parse(itemsString)
    } catch (error) {
      showErrorMsg(
        prefs.isEnglish ? 'Invalid items format' : 'פורמט פריטים לא תקין'
      )
      return
    }

    try {
      const payment = {
        userId,
        items,
        pelecardTransactionId,
      }

      // Save the payment
      const savedUser = await paymentService.save(payment)
      console.log(savedUser)

      // Update the cart after saving the payment
      updateCart(savedUser)
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
      <p>
        {prefs.isEnglish
          ? `One of our team will soon take care of it`
          : `אחד מאיתנו כבר מתחיל לטפל בהזמנה`}
      </p>

      <Lottie options={defaultOptions} height={200} width={200} />

      <button onClick={() => (window.location.href = '/')}>
        {prefs.isEnglish ? `Go to Home` : `מסך הבית`}
      </button>
    </div>
  )
}
