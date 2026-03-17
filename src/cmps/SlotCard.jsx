
import { useSelector } from "react-redux"
import BorderLinearProgress from "./BorderLinearProgress"
import GroupIcon from '@mui/icons-material/Group';
import { Button } from "@mui/material";
import { formatSlotDate, formatSlotTimeRange } from "../services/util.service";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import {CustomDialog} from "./CustomDialog";
import { useState } from "react";
import { RegisterForm } from "./RegisterForm";
import { setIsLoading } from "../store/actions/system.actions";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { slotService } from "../services/slot/slot.service";
import { SOCKET_EVENT_UPDATE_SLOT, socketService } from "../services/socket.service";
import IconButton from '@mui/material/IconButton';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';


const poolImg = 'https://ik.imagekit.io/n4mhohkzp/mouse-wheel-pool.webp?updatedAt=1755684294789'
const gymImg = 'https://ik.imagekit.io/n4mhohkzp/facilities-gym.jpg.png?updatedAt=1769599835723'

export function SlotCard({ slot, setSlots }) {
    const prefs = useSelector((storeState) => storeState.systemModule.prefs)
    const user = useSelector((storeState) => storeState.userModule.user)
    const [isModal, setIsModal] = useState(false)
    const [formData, setFormData] = useState(_getFormData())

    const isRegistered = localStorage.getItem(`registered-${slot._id}`)

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

        try {
            setIsLoading(true)
            const registered = await slotService.register(slot._id, formData)

            socketService.emit(SOCKET_EVENT_UPDATE_SLOT, registered)
            showSuccessMsg(prefs.isEnglish ? 'Registered successfully' : 'רישום בוצע בהצלחה')
            setSlots(prevSlots => prevSlots.map(prevSlot => prevSlot._id === slot._id ? registered : prevSlot))
            setIsModal(false)
            if(user && user.isAdmin) return
            localStorage.setItem(`registered-${slot._id}`, true)
        } catch (err) {
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
  return <>
  <div className={`slot-card-container ${slot.facility.toLowerCase()} ${prefs.isDarkMode ? 'dark-mode' : ''}`}>


    <div className={`thumbnail ${slot.facility.toLowerCase()} ${prefs.isDarkMode ? 'dark-mode' : ''}`}>
        <img src={slot.facility.toLowerCase() === 'pool' ? poolImg : gymImg} alt={slot.facility} />
        <span>{`${prefs.isEnglish ? 'Entrance to' : 'כניסה ל'}${modifyFacilityName(slot.facility)}`}</span>
    </div>
    <div className="content-container">

    <div className={`details ${user && user.isAdmin ? 'admin-details' : ''}`}>
      {user && user.isAdmin && <IconButton><FormatListNumberedIcon /></IconButton> }
        <span className="date">{`${formatSlotDate(slot.date, prefs.isEnglish)}`}</span>
        <span style={{ direction: 'ltr' }}>{formatSlotTimeRange(slot.startTime, slot.endTime)}</span>
    </div>
    <div className="progress-container" style={{ direction: 'ltr' }}>
      <GroupIcon />
        <span>{`${slot.registrations.length}`}</span>

        <BorderLinearProgress variant="determinate" value={slot.registrations.length / slot.capacity * 100} />
        <span>{`${slot.capacity}`}</span>
      </div>

{!isRegistered ? (
      <Button variant="contained" color="primary" onClick={() => setIsModal(true)} disabled={slot.registrations.length >= slot.capacity}><HowToRegIcon />{prefs.isEnglish ? 'Register' : 'רישום'}</Button>
      )
    : (
        <span className="registered-text"><HowToRegIcon />{prefs.isEnglish ? 'Registered' : 'רישום בוצע'}</span>
    )
    }

    </div>
  </div>

  <CustomDialog open={isModal} onClose={() => setIsModal(false)} title={prefs.isEnglish ? 'Register' : 'רישום'}>
    <RegisterForm isEnglish={prefs.isEnglish} onSubmit={onSubmit} formData={formData} setFormData={setFormData} />
  </CustomDialog>
  </>
}

