import { useSelector } from 'react-redux'

import Lottie from 'react-lottie'
import animationData from '/public/imgs/error.json'

export function ErrorPage() {
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
    <div className='error-page'>
      <h1>{prefs.isEnglish ? `Payment Failed` : `ההעברה נכשלה`}</h1>
      <p>
        {prefs.isEnglish
          ? `We are sorry, but your payment could not be processed.`
          : `מתנצלים, לא ניתן להשלים את התשלום`}
      </p>
      <Lottie options={defaultOptions} height={200} width={200} />
      <button onClick={() => (window.location.href = '/')}>
        {prefs.isEnglish ? `Go to Home` : `מסך הבית`}
      </button>
    </div>
  )
}
