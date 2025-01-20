import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { makeId, smoothScroll } from '../services/util.service'

import types from '/public/jsons/Members/Members.json'
import { setIsModal } from '../store/actions/system.actions'

export function MemberTypes() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const navigate = useNavigate()

  const navigateToMembers = () => {
    smoothScroll()
    navigate('/member')
    setIsModal(false)
  }
  return (
    <div className='member-types-container' onClick={navigateToMembers}>
      {types.map((type) => {
        return (
          <div
            className={`type-container ${type.index === 1 && 'center'} ${
              type.class
            } ${prefs.isDarkMode && 'dark-mode'}`}
            key={makeId()}
          >
            <b>{prefs.isEnglish ? type.title.eng : type.title.he}</b>
            <span style={{ fontSize: '1.2em' }}>
              {prefs.isEnglish ? type.preview.eng : type.preview.he}
            </span>
          </div>
        )
      })}
    </div>
  )
}
