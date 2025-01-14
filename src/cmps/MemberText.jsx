import { useSelector } from 'react-redux'
import { useRef } from 'react'

import { HeadContainer } from './HeadContainer'
import { makeId } from '../services/util.service'

import types from '/public/jsons/Members/Members.json'

export function MemberText() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

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
            key={makeId()}
          >
            <div className='text-container'>
              <HeadContainer text={type.title} />
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Explicabo nesciunt ipsa, neque suscipit libero laborum aperiam
                voluptates cum minus eligendi unde, possimus nostrum sed
                dignissimos rerum mollitia amet necessitatibus aspernatur!
              </p>
            </div>
            <img src={type.img} alt='' />
          </div>
        )
      })}
    </div>
  )
}
