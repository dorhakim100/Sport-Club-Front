import { SlotCard } from '../cmps/SlotCard'
import { HeadContainer } from '../cmps/HeadContainer'
import { Divider } from '@mui/material'
import { useSelector } from 'react-redux'
import { useState, useEffect, useMemo } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { slotService } from '../services/slot/slot.service'
import { setIsLoading } from '../store/actions/system.actions'
import { socketService, SOCKET_EVENT_ADD_SLOT_REGISTERED, SOCKET_EVENT_UPDATE_SLOT, SOCKET_EVENT_ADD_SLOT } from '../services/socket.service'
import { ContactUs } from '../cmps/ContactUs'
import { SlideAnimation } from '../cmps/SlideAnimation'
import { RegisterDayControlls } from '../cmps/RegisterDayControlls'

export function Register() {

    const text = {
        he:'רישום מראש',
        eng: 'Register Ahead',
    }

    const prefs = useSelector((storeState) => storeState.systemModule.prefs)
    const [slots, setSlots] = useState([])
    const [currFilter, setCurrFilter] = useState(slotService.getDefaultFilter())

    const [pageDirection, setPageDirection] = useState(1)




    const poolSlots = useMemo(() => slots.filter(slot=>slot.facility === 'pool'), [slots])
    const gymSlots = useMemo(() => slots.filter(slot=>slot.facility === 'gym'), [slots])
    const slotsLength = useMemo(() => slots.length, [slots])

    useEffect(() => {
        fetchSlots(currFilter)
    }, [currFilter])

    useEffect(()=>{
        socketService.on(SOCKET_EVENT_ADD_SLOT_REGISTERED, (slot) => {
            setSlots(prevSlots => prevSlots.map(prevSlot => prevSlot._id === slot._id ? slot : prevSlot))
        })
        // socketService.on(SOCKET_EVENT_ADD_SLOT, (startTime) => {
        //     const filter = slotService.getDefaultFilter()
        //     fetchSlots(filter)
        //     showSuccessMsg(prefs.isEnglish ? 'New hours added successfully' : 'שעות חדשות נפתחו')
        // })

        return () => {
            socketService.off(SOCKET_EVENT_ADD_SLOT_REGISTERED)
            // socketService.off(SOCKET_EVENT_ADD_SLOT)
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

    const onNextDay = () => {
        const filterToSet = slotService.getDatePaginationFilter(currFilter, 1)
        setCurrFilter(filterToSet)
        setPageDirection(1)
    }

    const onPreviousDay = () => {

        const filterToSet = slotService.getDatePaginationFilter(currFilter, -1)
        setCurrFilter(filterToSet)
        setPageDirection(-1)
    }

    const getPreviousDisabled = () => {
        const currDate = new Date(currFilter.date)
        if (Number.isNaN(currDate.getTime())) return true

        const today = new Date()
        const currDayStart = new Date(currDate)
        currDayStart.setHours(0, 0, 0, 0)
        today.setHours(0, 0, 0, 0)

        return currDayStart.getTime() === today.getTime()
    }

    const getNextDisabled = () => {
        const currDate = new Date(currFilter.date)
        if (Number.isNaN(currDate.getTime())) return true

        const maxDate = new Date()
        maxDate.setHours(0, 0, 0, 0)
        maxDate.setDate(maxDate.getDate() + 3)

        const currDayStart = new Date(currDate)
        currDayStart.setHours(0, 0, 0, 0)

        return currDayStart.getTime() === maxDate.getTime()
    }

  return (
    <div className='register-container'>
        <HeadContainer text={text} />
        <RegisterDayControlls
          date={currFilter.date}
          isEnglish={prefs.isEnglish}
          onPreviousDay={onPreviousDay}
          onNextDay={onNextDay}
          isPreviousDisabled={getPreviousDisabled()}
          isNextDisabled={getNextDisabled()}
        />
        <SlideAnimation motionKey={currFilter.date} direction={pageDirection} className="slots-animation-container">

        {slotsLength > 0 ? 
        <>
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
            </>
            :
            <div className="no-slots-container">
                <span>{prefs.isEnglish ? 'No available slots found' : 'לא נמצאו שעות זמינות'}</span>
            </div>
            }
            </SlideAnimation>
            <ContactUs/>
    </div>
  )
}