import { SlotCard } from '../cmps/SlotCard'
import { HeadContainer } from '../cmps/HeadContainer'
import { Divider } from '@mui/material'
import { useSelector } from 'react-redux'
import { useState, useEffect, useMemo } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { slotService } from '../services/slot/slot.service'
import { setIsLoading } from '../store/actions/system.actions'
import { socketService, SOCKET_EVENT_ADD_SLOT_REGISTERED, SOCKET_EVENT_UPDATE_SLOT, SOCKET_EVENT_ADD_SLOT } from '../services/socket.service'

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
        fetchSlots(currFilter)
    }, [currFilter])

    useEffect(()=>{
        socketService.on(SOCKET_EVENT_ADD_SLOT_REGISTERED, (slot) => {
            setSlots(prevSlots => prevSlots.map(prevSlot => prevSlot._id === slot._id ? slot : prevSlot))
        })
        socketService.on(SOCKET_EVENT_ADD_SLOT, (startTime) => {
            const filter = slotService.getDefaultFilter()
            fetchSlots(filter)
            showSuccessMsg(prefs.isEnglish ? 'New hours added successfully' : 'שעות חדשות נפתחו')
        })

        return () => {
            socketService.off(SOCKET_EVENT_ADD_SLOT_REGISTERED)
            socketService.off(SOCKET_EVENT_ADD_SLOT)
        }
    },[])

    async function fetchSlots(filter) {
        try {
            setIsLoading(true)
            const s = await slotService.query(filter)
            setSlots(s)
        } catch (err) {
            showErrorMsg(prefs.isEnglish ? 'Error fetching slots' : 'שגיאה בטעינת שעות רישום')
        } finally {
            setIsLoading(false)
        }

    }

    const deleteRegistration = async ( newSlot) => {
        
        try {
            setIsLoading(true)
            await slotService.updateSlot(newSlot)
            socketService.emit(SOCKET_EVENT_UPDATE_SLOT, newSlot)
            showSuccessMsg(prefs.isEnglish ? 'Registration deleted successfully' : 'רישום נמחק בהצלחה')
            
            setSlots(prevSlots => prevSlots.map(prevSlot => prevSlot._id === newSlot._id ? newSlot : prevSlot))
        } catch (err) {
            showErrorMsg(prefs.isEnglish ? 'Error deleting registration' : 'שגיאה במחיקת רישום')
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

          <SlotCard slot={slot} setSlots={setSlots} deleteRegistration={deleteRegistration} />
        </div>
        ))}
        </div>
        <Divider className={`divider ${prefs.isDarkMode ? 'dark-mode' : ''}`} />
        <div className="slots-container">
            {gymSlots.map((slot) => (
                <div className="slot-container" key={slot._id}>
                    <SlotCard slot={slot} setSlots={setSlots} deleteRegistration={deleteRegistration} />
                </div>
            ))}
            </div>
    </div>
  )
}