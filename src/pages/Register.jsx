import { SlotCard } from '../cmps/SlotCard'
import { SLOTS } from '../data/slots'
import { HeadContainer } from '../cmps/HeadContainer'

export function Register() {

    const text = {
        he:'רישום מראש',
        eng: 'Register Ahead',
    }

  return (
    <div className='register-container'>
        <HeadContainer text={text} />
        <div className="slots-container">
      {SLOTS.map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
        </div>
    </div>
  )
}