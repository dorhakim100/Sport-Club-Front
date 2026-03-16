import { SlotCard } from '../cmps/SlotCard'
import { SLOTS } from '../data/slots'
import { HeadContainer } from '../cmps/HeadContainer'
import { Divider } from '@mui/material'
import { useSelector } from 'react-redux'
import { useState, useEffect, useMemo } from 'react'
import { showErrorMsg } from '../services/event-bus.service'
import { slotService } from '../services/slot/slot.service'
import { setIsLoading } from '../store/actions/system.actions'

export function Register() {

    const text = {
        he:'רישום מראש',
        eng: 'Register Ahead',
    }

    const prefs = useSelector((storeState) => storeState.systemModule.prefs)
    const [slots, setSlots] = useState([])
    const [currFilter, setCurrFilter] = useState(slotService.getDefaultFilter())

    const poolSlots = useMemo(() => slots.filter(slot=>slot.facility === 'pool'), [slots])
    const gymSlots = useMemo(() => slots.filter(slot=>slot.facility === 'gym'), [slots])

    useEffect(() => {
        fetchSlots()

    }, [currFilter])



    async function fetchSlots() {
        try {
            setIsLoading(true)
            const s = await slotService.query(currFilter)
            setSlots(s)
        } catch (err) {
            showErrorMsg(prefs.isEnglish ? 'Error fetching slots' : 'שגיאה בטעינת שעות רישום')
        } finally {
            setIsLoading(false)
        }

    }

  return (
    <div className='register-container'>
        <HeadContainer text={text} />
        <div className="slots-container">
      {poolSlots.map((slot) => (
        <div className="slot-container" key={slot._id}>

          <SlotCard slot={slot} setSlots={setSlots} />
        </div>
        ))}
        </div>
        <Divider className={`divider ${prefs.isDarkMode ? 'dark-mode' : ''}`} />

        <div className="slots-container">
            {gymSlots.map((slot) => (
                <div className="slot-container" key={slot._id}>
                    <SlotCard slot={slot} setSlots={setSlots} />
                </div>
            ))}
            </div>
    </div>
  )
}