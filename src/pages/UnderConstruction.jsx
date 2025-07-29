import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

export function UnderConstruction() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const content = {
    title: {
      he: 'האתר בשיפוצים',
      eng: 'Site Under Construction',
    },
    subtitle: {
      he: 'אנחנו עובדים קשה להכין עבורכם משהו מיוחד',
      eng: 'We are working hard to bring you something special',
    },
    description: {
      he: 'האתר של מועדון הספורט יהיה מוכן בקרוב! אנא חזרו בקרוב לחווית משתמש משופרת עם תכונות חדשות ומעוצבות.',
      eng: 'Our sports club website will be ready soon! Please check back for an enhanced user experience with new and improved features.',
    },
    backHome: {
      he: 'חזרה לעמוד הבית',
      eng: 'Back to Home',
    },
    contact: {
      he: 'צרו קשר',
      eng: 'Contact Us',
    },
  }

  return (
    <div
      className={`under-construction ${prefs.isDarkMode ? 'dark-mode' : ''} ${
        animated ? 'animate' : ''
      }`}
    >
      <div className='construction-container'>
        {/* Construction Icon/Animation */}
        <div className='construction-icon'>
          <div className='gear gear-1'></div>
          <div className='gear gear-2'></div>
          <div className='construction-sign'>🚧</div>
        </div>

        {/* Main Content */}
        <div
          className='construction-content'
          style={prefs.isEnglish ? { direction: 'ltr' } : { direction: 'rtl' }}
        >
          <h1>{prefs.isEnglish ? content.title.eng : content.title.he}</h1>
          <h2>
            {prefs.isEnglish ? content.subtitle.eng : content.subtitle.he}
          </h2>
          <p>
            {prefs.isEnglish ? content.description.eng : content.description.he}
          </p>

          {/* Progress Bar */}
          <div className='progress-container'>
            <div className='progress-bar'>
              <div className='progress-fill'></div>
            </div>
            <span className='progress-text'>75%</span>
          </div>

          {/* Action Buttons */}
          {/* <div className='construction-buttons'>
            <a
              to='/about'
              className='btn btn-secondary'
              onClick={() => {
                window.location.href = 'tel:099580404'
              }}
            >
              {prefs.isEnglish ? content.contact.eng : content.contact.he}
            </a>
          </div> */}
        </div>

        {/* Background Elements */}
        <div className='bg-elements'>
          <div className='floating-element element-1'></div>
          <div className='floating-element element-2'></div>
          <div className='floating-element element-3'></div>
        </div>
      </div>
    </div>
  )
}
