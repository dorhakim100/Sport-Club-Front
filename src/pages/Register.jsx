import { SlotCard } from '../cmps/SlotCard'
import { SLOTS } from '../data/slots'
import { HeadContainer } from '../cmps/HeadContainer'
import { Divider } from '@mui/material'
import { useSelector } from 'react-redux'

export function Register() {

    const text = {
        he:'רישום מראש',
        eng: 'Register Ahead',
    }

    const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  return (
    <div className='register-container'>
        <HeadContainer text={text} />
        <div className="slots-container">
      {SLOTS.filter(slot=>slot.facility === 'pool').map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
        </div>
        <Divider className={`divider ${prefs.isDarkMode ? 'dark-mode' : ''}`} />

        <div className="slots-container">
            {SLOTS.filter(slot=>slot.facility === 'gym').map((slot) => (
                <SlotCard key={slot.id} slot={slot} />
            ))}
            </div>
    </div>
  )
}