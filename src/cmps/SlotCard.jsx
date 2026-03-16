
import { useSelector } from "react-redux"
import BorderLinearProgress from "./BorderLinearProgress"
import GroupIcon from '@mui/icons-material/Group';
import { Button } from "@mui/material";
import { formatSlotDate } from "../services/util.service";

export function SlotCard({ slot }) {
    const prefs = useSelector((storeState) => storeState.systemModule.prefs)
    console.log(slot)
  return <div className={`slot-card-container ${prefs.isDarkMode ? 'dark-mode' : ''}`}>


    <div className={`thumbnail ${slot.facility.toLowerCase()} ${prefs.isDarkMode ? 'dark-mode' : ''}`}>
        <span>{`Entrance to ${slot.facility}`}</span>
    </div>
    <div className="content-container">

    <div className="details">
        <span className="date">{`${formatSlotDate(slot.date)}`}</span>
        <span style={{ direction: 'ltr' }}>{`${slot.startTime} - ${slot.endTime}`}</span>
    </div>
    <div className="progress-container" style={{ direction: 'ltr' }}>
      <GroupIcon />
        <span>{`${slot.registrations.length}`}</span>

        <BorderLinearProgress variant="determinate" value={slot.registrations.length / slot.capacity * 100} />
        <span>{`${slot.capacity}`}</span>
      </div>

      <Button variant="contained" color="primary">Register</Button>

    </div>
  </div>
}