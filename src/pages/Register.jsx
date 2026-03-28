import { SlotCard } from '../cmps/SlotCard'
import { HeadContainer } from '../cmps/HeadContainer'
import { Button, Divider } from '@mui/material'
import { useSelector } from 'react-redux'
import { useState, useEffect, useMemo } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { slotService } from '../services/slot/slot.service'
import { setIsLoading } from '../store/actions/system.actions'
import { socketService, SOCKET_EVENT_ADD_SLOT_REGISTERED, SOCKET_EVENT_UPDATE_SLOT, SOCKET_EVENT_ADD_SLOT } from '../services/socket.service'
import { ContactUs } from '../cmps/ContactUs'
import { SlideAnimation } from '../cmps/SlideAnimation'
import { RegisterDayControlls } from '../cmps/RegisterDayControlls'
import { formatTimeValue, getTxtRegex } from '../services/util.service'
export function Register() {

    const text = {
        he:'רישום מראש',
        eng: 'Register Ahead',
    }

    const prefs = useSelector((storeState) => storeState.systemModule.prefs)
    const user = useSelector((storeState) => storeState.userModule.user)
    const [slots, setSlots] = useState([])
    const [currFilter, setCurrFilter] = useState(slotService.getDefaultFilter())

    const [pageDirection, setPageDirection] = useState(1)

    const [facilityRegistered, setFacilityRegistered] = useState(JSON.parse(localStorage.getItem(`registered-${currFilter.date}`)) || {})

    const [currHour, setCurrHour] = useState(new Date().getHours())

    const [search, setSearch] = useState('')

    
        const poolSlots = useMemo(() => slots.filter(slot=>slot.facility === 'pool' 
            // && slot.registrations.some(registration=>getTxtRegex(search).test(registration.name) || getTxtRegex(search).test(registration.phone))
        ), [slots,search])
        const gymSlots = useMemo(() => slots.filter(slot=>slot.facility === 'gym' 
            // && slot.registrations.some(registration=>getTxtRegex(search).test(registration.name) || getTxtRegex(search).test(registration.phone))
        ), [slots,search])
        const slotsLength = useMemo(() => slots.length, [slots])

const poolDisabled = useMemo(()=>{
    return facilityRegistered.pool

},[facilityRegistered,currFilter.date])

const gymDisabled = useMemo(()=>{
    return facilityRegistered.gym

},[facilityRegistered,currFilter.date])

const currSlots = useMemo(()=>{
    const hourToSet = currHour < 10 ? `0${currHour}` : currHour
    
    return slots.filter(slot=>(formatTimeValue(slot.startTime) === `${hourToSet}:00`) && slot.date === new Date().toISOString().split('T')[0]) || []
},[slots,currHour])



    useEffect(() => {
        fetchSlots(currFilter)
        const facilityRegistered = JSON.parse(localStorage.getItem(`registered-${currFilter.date}`)) || {}
        setFacilityRegistered(facilityRegistered)
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
        setCurrHour(new Date().getHours())
            
        const interval = setInterval(()=>{
            if(new Date().getHours() === currHour) return
            setCurrHour(new Date().getHours())
        },1000)

        return () => {
            socketService.off(SOCKET_EVENT_ADD_SLOT_REGISTERED)
            // socketService.off(SOCKET_EVENT_ADD_SLOT)
            clearInterval(interval)
        }
    },[])

    async function fetchSlots(filter) {
        try {
            setIsLoading(true)
            const s = await slotService.query(filter)
            console.log('s',s)
            setSlots(s)
        } catch (err) {
            showErrorMsg(prefs.isEnglish ? 'Error fetching slots' : 'שגיאה בטעינת שעות רישום')
        } finally {
            setIsLoading(false)
        }

    }

    const cancelRegistration = async ( slotId, phoneToDelete) => {

        try {
            setIsLoading(true)
            const updatedSlot = await slotService.cancelRegistration(slotId, phoneToDelete)
            socketService.emit(SOCKET_EVENT_UPDATE_SLOT, updatedSlot)
            showSuccessMsg(prefs.isEnglish ? 'Registration deleted successfully' : 'רישום נמחק בהצלחה')
            setSlots(prevSlots => prevSlots.map(prevSlot => prevSlot._id === slotId ? updatedSlot : prevSlot))
            const facilityRegisteredToSet = {
                ...facilityRegistered,
                [updatedSlot.facility]: false
            }
            setFacilityRegistered(facilityRegisteredToSet)
            localStorage.setItem(`registered-${currFilter.date}`,JSON.stringify(facilityRegisteredToSet))

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



    const getInputPlaceholder = () => {
        return prefs.isEnglish ? 'Search members by name or phone number' : 'חיפוש לפי שם או מספר טלפון'
    }
    

  return (
    <div className='register-container'>
        <HeadContainer text={text} />
        <div className="filter-container">

       {/* {user && user.isAdmin && <div className={`input-container ${prefs.isDarkMode ? 'dark-mode' : ''}`}>
            <input type="search" placeholder={getInputPlaceholder()} value={search} onChange={e => setSearch(e.target.value)} />
        </div>} */}
        <RegisterDayControlls
          date={currFilter.date}
          isEnglish={prefs.isEnglish}
          onPreviousDay={onPreviousDay}
          onNextDay={onNextDay}
          isPreviousDisabled={getPreviousDisabled()}
          isNextDisabled={getNextDisabled()}
          />
          </div>
        <SlideAnimation motionKey={currFilter.date} direction={pageDirection} className="slots-animation-container">

        {slotsLength > 0 ? 
        <>
        <div className="slots-container">
      {poolSlots.map((slot) => (
          <div className="slot-container" key={slot._id}>

          <SlotCard slot={slot} setSlots={setSlots} cancelRegistration={cancelRegistration} disabled={poolDisabled} facilityRegistered={facilityRegistered} setFacilityRegistered={setFacilityRegistered} currSlots={currSlots} search={search} />
        </div>
        ))}
        </div>
        <Divider className={`divider ${prefs.isDarkMode ? 'dark-mode' : ''}`} />
        <div className="slots-container">
            {gymSlots.map((slot) => (
                <div className="slot-container" key={slot._id}>
                    <SlotCard slot={slot} setSlots={setSlots} cancelRegistration={cancelRegistration} disabled={gymDisabled} facilityRegistered={facilityRegistered} setFacilityRegistered={setFacilityRegistered} currSlots={currSlots} search={search} />
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