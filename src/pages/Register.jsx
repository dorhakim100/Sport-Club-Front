import { SlotCard } from '../cmps/SlotCard'
import { SLOTS } from '../data/slots'

export function Register() {
    console.log(SLOTS)
  return (
    <div className='register-container'>
        <div className="slots-container">
      {SLOTS.map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
        </div>
    </div>
  )
}