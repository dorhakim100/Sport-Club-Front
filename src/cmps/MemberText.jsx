import { useSelector } from 'react-redux'
import { useEffect } from 'react'

import { HeadContainer } from './HeadContainer'
import { makeId, textAnimation } from '../services/util.service'

import types from '/public/jsons/Members/Members.json'

export function MemberText() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  function getCurrMember() {
    const now = new Date() // Get current date and time
    const month = now.getMonth() // Month is zero-based (0 = January, 6 = July, 7 = August)

    // Check the month and return the membership type
    return month >= 4 && month <= 7 ? 'summer' : 'winter'
  }

  useEffect(() => {
    textAnimation(prefs)
  }, [prefs.isEnglish, prefs.isDarkMode])

  return (
    <div className='member-texts-container'>
      {types.map((type) => {
        return (
          <div
            className={`member-container section hidden ${type.class} ${
              type.class === getCurrMember() ? 'second' : ''
            } `}
            key={makeId()}
          >
            <div className='text-container'>
              <HeadContainer text={type.title} />
              <p>
                {prefs.isEnglish ? type.description.eng : type.description.he}
              </p>
            </div>
            <img src={type.img} alt='' />
          </div>
        )
      })}
    </div>
  )
}
