import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Lottie from 'react-lottie'
import animationData from '/public/imgs/success.json'

export function SuccessPage() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const defaultOptions = {
    loop: false,
    autoplay: true, // Animation will autoplay
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  return (
    <div className='success-page'>
      <h1>{prefs.isEnglish ? `Payment Successful` : `תשלום הצליח`}</h1>
      <p>
        {prefs.isEnglish
          ? ` Your payment has been processed successfully.`
          : `התשלום עבר בהצלחה`}
      </p>

      <Lottie options={defaultOptions} height={200} width={200} />

      <button onClick={() => (window.location.href = '/')}>
        {prefs.isEnglish ? `Go to Home` : `מסך הבית`}
      </button>
    </div>
  )
}
