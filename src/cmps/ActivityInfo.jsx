import { useSelector } from 'react-redux'
import { useEffect } from 'react'

export function ActivityInfo({ options, logo }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <div className='activity-info-container'>
      {(!logo && (
        <span className='section hidden'>
          {prefs.isEnglish
            ? (options.title.eng === 'H2o' && (
                <>
                  H<span className='small-two'>2</span>o
                </>
              )) ||
              options.title.eng
            : (options.title.he === 'H2o' && (
                <>
                  H<span className='small-two'>2</span>o
                </>
              )) ||
              options.title.he}
        </span>
      )) || (
        <div className='img-container'>
          <img src={prefs.isDarkMode ? logo.darkMode : logo.regular} alt='' />
        </div>
      )}
      <p className='section hidden'>
        {prefs.isEnglish ? options.preview.eng : options.preview.he}
      </p>
    </div>
  )
}
