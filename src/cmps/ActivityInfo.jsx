import { useSelector } from 'react-redux'

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
        <div className='img-container logo'>
          <img src={prefs.isDarkMode ? logo.darkMode : logo.regular} alt='' />
        </div>
      )}
      <p className='section hidden'>
        {prefs.isEnglish ? options.preview.eng : options.preview.he}
      </p>
      <b className='section hidden'>
        {prefs.isEnglish ? options.ending.eng : options.ending.he}
      </b>
    </div>
  )
}
