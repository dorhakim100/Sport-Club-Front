import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeId, textAnimation } from '../services/util.service'

import { HeadContainer } from './HeadContainer'

export function FacilitiesTxt({ facilities }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  useEffect(() => {
    textAnimation(prefs)
  }, [prefs.isEnglish, prefs.isDarkMode])

  return (
    <div className='facilities-text-container'>
      {facilities.map((facility) => {
        return (
          <div className={`facility-container`} key={facility.type}>
            <HeadContainer
              text={{ eng: facility.title.eng, he: facility.title.he }}
            />
            <div className='facility-content-container'>
              <div className='facility-txt-container section hidden'>
                <p>
                  {prefs.isEnglish
                    ? facility.description.eng
                    : facility.description.he}
                </p>
              </div>
            </div>
            <img
              src={facility.img}
              className='section hidden'
              alt={facility.type}
            />
          </div>
        )
      })}
    </div>
  )
}
