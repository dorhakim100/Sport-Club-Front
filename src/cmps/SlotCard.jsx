
import { useSelector } from "react-redux"
import BorderLinearProgress from "./BorderLinearProgress"
import GroupIcon from '@mui/icons-material/Group';
import { Button } from "@mui/material";
import { formatSlotDate, formatSlotTimeRange } from "../services/util.service";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import {CustomDialog} from "./CustomDialog";
import { useState } from "react";

export function SlotCard({ slot }) {
    const prefs = useSelector((storeState) => storeState.systemModule.prefs)
    const [isModal, setIsModal] = useState(false)



    const modifyFacilityName = (facility) => {
        if (facility === 'pool') return prefs.isEnglish ? ' the Pool' : 'בריכה'
        if (facility === 'gym') return prefs.isEnglish ? ' the Gym' : 'חדר הכושר'
        return facility
    }
  return <>
  <div className={`slot-card-container ${prefs.isDarkMode ? 'dark-mode' : ''} ${slot.facility.toLowerCase()}`}>


    <div className={`thumbnail ${slot.facility.toLowerCase()} ${prefs.isDarkMode ? 'dark-mode' : ''}`}>
        <span>{`${prefs.isEnglish ? 'Entrance to' : 'כניסה ל'}${modifyFacilityName(slot.facility)}`}</span>
    </div>
    <div className="content-container">

    <div className="details">
        <span className="date">{`${formatSlotDate(slot.date)}`}</span>
        <span style={{ direction: 'ltr' }}>{formatSlotTimeRange(slot.startTime, slot.endTime)}</span>
    </div>
    <div className="progress-container" style={{ direction: 'ltr' }}>
      <GroupIcon />
        <span>{`${slot.registrations.length}`}</span>

        <BorderLinearProgress variant="determinate" value={slot.registrations.length / slot.capacity * 100} />
        <span>{`${slot.capacity}`}</span>
      </div>

      <Button variant="contained" color="primary" onClick={() => setIsModal(true)}><HowToRegIcon />{prefs.isEnglish ? 'Register' : 'רישום'}</Button>

    </div>
  </div>

  <CustomDialog open={isModal} onClose={() => setIsModal(false)} title={prefs.isEnglish ? 'Register' : 'רישום'}>

  </CustomDialog>
  </>
}

