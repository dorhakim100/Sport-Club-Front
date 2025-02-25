import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import Lottie from 'react-lottie'

import loaderSvg from '../../public/imgs/swimming.gif' // Adjust the path according to your project structure
import loaderSvgDarkMode from '../../public/imgs/swimming-dark-mode.gif'

import loaderJson from '../../public/imgs/loader-jsons/loader.json'
import loaderDarkJson from '../../public/imgs/loader-jsons/loader_dark_mode.json'
import { setIsLoading } from '../store/actions/system.actions'

export function Loader() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isLoading = useSelector(
    (storeState) => storeState.systemModule.isLoading
  )
  const [loader, setLoader] = useState(loaderJson)

  const defaultOptions = {
    loop: false,
    autoplay: true, // Animation will autoplay
    animationData: loader,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  useEffect(() => {
    if (prefs.isDarkMode) {
      setLoader(loaderDarkJson)
    } else {
      setLoader(loaderJson)
    }
  }, [prefs.isDarkMode])

  return (
    isLoading && (
      <div
        className='loader-container'
        style={{
          transform: prefs.isEnglish ? '' : 'scaleX(-1)',
          display: 'block',
        }}
      >
        <Lottie options={defaultOptions} width={'100%'} height={'100%'} />
      </div>
    )
  )
}
