import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'

import loaderSvg from '../../public/imgs/swimming.gif' // Adjust the path according to your project structure
import loaderSvgDarkMode from '../../public/imgs/swimming-dark-mode.gif'

export function Loader() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isLoading = useSelector(
    (storeState) => storeState.systemModule.isLoading
  )

  const [loader, setLoader] = useState(loaderSvg)

  useEffect(() => {
    if (prefs.isDarkMode) {
      setLoader(loaderSvgDarkMode)
    } else {
      setLoader(loaderSvg)
    }
  }, [prefs.isDarkMode])
  return (
    isLoading && (
      <div className='loader-container'>
        <img
          src={loader}
          alt=''
          style={{
            transform: prefs.isEnglish ? '' : 'scaleX(-1)',
            display: 'block',
          }}
        />
      </div>
    )
  )
}
