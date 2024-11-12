import { useSelector } from 'react-redux'
import { useEffect } from 'react'

export function ActivityInfo({ options }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <div className='activity-info-container'>
      <span className='section hidden'>
        {prefs.isEnglish ? options.title.eng : options.title.he}
      </span>
      <p className='section hidden'>
        {prefs.isEnglish ? options.preview.eng : options.preview.he}
      </p>
    </div>
  )
}
