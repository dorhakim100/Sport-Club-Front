
import { useSelector } from "react-redux"
import BorderLinearProgress from "./BorderLinearProgress"
import GroupIcon from '@mui/icons-material/Group';
import { Button } from "@mui/material";
import { formatSlotDate, formatSlotTimeRange } from "../services/util.service";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import {CustomDialog} from "./CustomDialog";
import { useEffect, useMemo, useState } from "react";
import { RegisterForm } from "./RegisterForm";
import { setIsLoading } from "../store/actions/system.actions";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { slotService } from "../services/slot/slot.service";
import { SOCKET_EVENT_UPDATE_SLOT, socketService } from "../services/socket.service";
import IconButton from '@mui/material/IconButton';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import {RegistrationList} from "./RegistrationList";
import DeleteIcon from '@mui/icons-material/Delete';


const poolImg = 'https://ik.imagekit.io/n4mhohkzp/mouse-wheel-pool.webp?updatedAt=1755684294789'
const gymImg = 'https://ik.imagekit.io/n4mhohkzp/facilities-gym.jpg.png?updatedAt=1769599835723'

const MODAL_TYPES = {
    REGISTER: 'register',
    LIST: 'list',
}

export function SlotCard({ slot, setSlots, cancelRegistration, disabled, facilityRegistered, setFacilityRegistered, currSlots }) {
    const prefs = useSelector((storeState) => storeState.systemModule.prefs)
    const user = useSelector((storeState) => storeState.userModule.user)
    const [isModal, setIsModal] = useState(false)
    const [formData, setFormData] = useState(_getFormData())

    const [modalType, setModalType] = useState(MODAL_TYPES.REGISTER)

    const [registeredObject, setRegisteredObject] = useState(null)
    
        const isRegisterDisabled = useMemo(()=>{
        return  slot.registrations.length >= slot.capacity
        // return disabled || slot.registrations.length >= slot.capacity
    },[disabled, slot.registrations.length, slot.capacity])

    const isCurrSlot = useMemo(()=>{
        return currSlots.find(currSlot => currSlot._id === slot._id)
    },[currSlots, slot._id])

    useEffect(()=>{
        if(!slot._id) return
        const registeredObjectToSet = localStorage.getItem(`registered-${slot._id}`)
        if(registeredObjectToSet !== JSON.stringify(registeredObject))setRegisteredObject(JSON.parse(registeredObjectToSet) || null)
    },[slot])

    const modifyFacilityName = (facility) => {
        if (facility === 'pool') return prefs.isEnglish ? ' the Pool' : 'בריכה'
        if (facility === 'gym') return prefs.isEnglish ? ' the Gym' : 'חדר הכושר'
        return facility
    }
    async function onSubmit(e) {
        e.preventDefault()
        if (slot.registrations.length >= slot.capacity) {
            showErrorMsg(prefs.isEnglish ? 'Slot is full' : 'השעה מלאה')
            return
        }

        if(!formData.phone || !formData.name){
            showErrorMsg(prefs.isEnglish ? 'Please fill in all fields' : 'יש למלא את כל השדות')
            return
        }

        if(facilityRegistered[slot.facility]){
            showErrorMsg(prefs.isEnglish ? 'You are already registered to this facility on this date' : 'ניתן להירשם לכל פעילות פעם ביום')
            return
        }

        try {
            setIsLoading(true)
            const registered = await slotService.register(slot._id, formData)

            socketService.emit(SOCKET_EVENT_UPDATE_SLOT, registered)
            showSuccessMsg(prefs.isEnglish ? 'Registered successfully' : 'רישום בוצע בהצלחה')
            setSlots(prevSlots => prevSlots.map(prevSlot => prevSlot._id === slot._id ? registered : prevSlot))
            setIsModal(false)
            if(user && user.isAdmin) return
            const registeredObject = {
                 isRegistered: true, _id: slot._id,
                name: formData.name,
                 phone: formData.phone
             }
            localStorage.setItem(`registered-${slot._id}`, JSON.stringify(registeredObject))
            setRegisteredObject(registeredObject)
            const facilityRegisteredToSet = {
                ...facilityRegistered,
                [slot.facility]: true
            }
            setFacilityRegistered(facilityRegisteredToSet)
            localStorage.setItem(`registered-${slot.date}`,JSON.stringify(facilityRegisteredToSet))
        } catch (err) {

            const alreadyRegistered = 'User already registered for this slot today'
            const errorMessage = err.response.data.err

            if(alreadyRegistered === errorMessage) {
                showErrorMsg(prefs.isEnglish ? 'You are already registered to this facility on this date' : 'ניתן להירשם לכל פעילות פעם ביום')
                return
            }
        
            showErrorMsg(prefs.isEnglish ? 'Error registering' : 'שגיאה ברישום')
            
        }       finally {
            setIsLoading(false)
        }
       
    }

    function _getFormData() {
        if(user && user.isAdmin) return { name: '', phone: '' }
        if(user) return { name: user.fullname, phone: user.phone }
        return { name: '', phone: '' }
    }

    function getModalContent() {
        if(modalType === MODAL_TYPES.REGISTER) return <RegisterForm isEnglish={prefs.isEnglish} onSubmit={onSubmit} formData={formData} setFormData={setFormData} />
        if(modalType === MODAL_TYPES.LIST) return <RegistrationList slot={slot} cancelRegistration={cancelRegistration} />
        return null
    }

    function _getModalTitle() {
        return `${formatSlotDate(slot.date, prefs.isEnglish)}, ${formatSlotTimeRange(slot.startTime, slot.endTime)}`
        if(modalType === MODAL_TYPES.REGISTER) return prefs.isEnglish ? 'Register' : 'רישום'
        if(modalType === MODAL_TYPES.LIST) return prefs.isEnglish ? 'Registered List' : 'רשימת נרשמים'
        return ''
    }

    const onOpenModal = (type) => {
        setIsModal(true)
        setModalType(type)
    }

    const onCancelRegistration = async () => {
        const registeredObject = JSON.parse(localStorage.getItem(`registered-${slot._id}`)) || null
        if(!registeredObject || !registeredObject?.isRegistered || !registeredObject?.phone) return
        
        const phoneToDelete = registeredObject.phone

        try {
            setIsLoading(true)
            await cancelRegistration(slot._id, phoneToDelete)
            showSuccessMsg(prefs.isEnglish ? 'Registration canceled successfully' : 'רישום נמחק בהצלחה')
            setRegisteredObject(null)
            localStorage.removeItem(`registered-${slot._id}`)
        } catch (err) {
            showErrorMsg(prefs.isEnglish ? 'Error canceling registration' : 'שגיאה במחיקת רישום')
        } finally {
            setIsLoading(false)
        }
    }



    const getRegistrationButton = () => {
        if(registeredObject && registeredObject?.isRegistered) return <span className="registered-text"><HowToRegIcon />{prefs.isEnglish ? 'Registered' : 'רישום בוצע'}
        <IconButton color='error' onClick={() => onCancelRegistration()}><DeleteIcon /></IconButton>
        </span>
        return <Button variant="contained" color="primary" onClick={() => onOpenModal(MODAL_TYPES.REGISTER)} disabled={isRegisterDisabled}><HowToRegIcon />{prefs.isEnglish ? 'Register' : 'רישום'}</Button>
    }



  return <>
  <div className={`slot-card-container ${slot.facility.toLowerCase()} ${prefs.isDarkMode ? 'dark-mode' : ''} ${isCurrSlot ? 'curr-slot' : ''}`}>


    <div className={`thumbnail ${slot.facility.toLowerCase()} ${prefs.isDarkMode ? 'dark-mode' : ''} ${prefs.isEnglish ? 'eng' : ''}`}>
        <img src={slot.facility.toLowerCase() === 'pool' ? poolImg : gymImg} alt={slot.facility} />
        <span>{`${prefs.isEnglish ? 'Entrance to' : 'כניסה ל'}${modifyFacilityName(slot.facility)}`}</span>
    </div>
    <div className="content-container">

    <div className={`details ${user && user.isAdmin ? 'admin-details' : ''}`}>
      {user && user.isAdmin && <IconButton className={`${prefs.isDarkMode ? 'dark-mode' : ''}`} onClick={() => onOpenModal(MODAL_TYPES.LIST)}><FormatListNumberedIcon /></IconButton> }
        <span style={{ direction: 'ltr' }} className="time">{formatSlotTimeRange(slot.startTime, slot.endTime)}</span>
        <span className="date">{`${formatSlotDate(slot.date, prefs.isEnglish)}`}</span>
    </div>
    <div className="progress-container" style={{ direction: 'ltr' }}>
      <GroupIcon />
        <span>{`${slot.registrations.length}`}</span>

        <BorderLinearProgress variant="determinate" value={slot.registrations.length / slot.capacity * 100} />
        <span>{`${slot.capacity}`}</span>
      </div>

{getRegistrationButton()}

    </div>
  </div>

  <CustomDialog open={isModal} onClose={() => setIsModal(false)} title={_getModalTitle()}>
    {getModalContent()}
  </CustomDialog>
  </>
}

