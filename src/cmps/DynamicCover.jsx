import { useState } from 'react'
import { Preloader } from './Preloader'
export function DynamicCover({ coverSrc, prefs }) {
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <div
      className={`cover-container ${prefs.isDarkMode && 'dark-mode'} full`}
      // style={{ position: 'relative' }}
    >
      <img src={coverSrc} alt='' onLoad={() => setIsLoaded(true)} />
      {/* {!isLoaded && (
        <div className='preloader-container'>
          <Preloader img={coverSrc} />
        </div>
      )} */}
    </div>
  )
}
