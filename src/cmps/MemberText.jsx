import { useSelector } from 'react-redux'
import { useEffect } from 'react'

import { HeadContainer } from './HeadContainer'
import { makeId, textAnimation } from '../services/util.service'

import typesJson from '/public/jsons/Members/Members.json'

export function MemberText() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const animation = true

  useEffect(() => {
    textAnimation(prefs)
  }, [prefs.isEnglish, prefs.isDarkMode])

  const types = typesJson

  function getCurrMember() {
    const now = new Date() // Get current date and time
    const month = now.getMonth() // Month is zero-based (0 = January, 6 = July, 7 = August)

    // Check the month and return the membership type
    return month >= 4 && month <= 7 ? 'summer' : 'winter'
  }

  return (
    <div className='member-texts-container'>
      {types.map((type) => {
        return (
          <div
            className={`member-container ${type.class} ${
              type.class === getCurrMember() ? 'second' : ''
            } `}
            // key={makeId()}
            key={type.class}
          >
            <div className='text-container'>
              <HeadContainer text={type.title} />
              <p className={`section hidden`}>
                {prefs.isEnglish ? type.description.eng : type.description.he}
              </p>
            </div>
            <img src={type.img} alt='' className={`section hidden`} />
          </div>
        )
      })}
    </div>
  )
}
