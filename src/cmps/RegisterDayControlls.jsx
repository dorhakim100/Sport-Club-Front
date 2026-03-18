import PropTypes from 'prop-types'
import IconButton from '@mui/material/IconButton'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { formatSlotDate } from '../services/util.service'

export function RegisterDayControlls({
  date,
  isEnglish,
  onPreviousDay,
  onNextDay,
  isPreviousDisabled,
  isNextDisabled,
}) {
  return (
    <div className='day-controlls-container'>
      <IconButton onClick={onPreviousDay} disabled={isPreviousDisabled}>
        {isEnglish ? <ArrowBackIcon /> : <ArrowForwardIcon />}
      </IconButton>

      <span>{formatSlotDate(date, isEnglish)}</span>

      <IconButton onClick={onNextDay} disabled={isNextDisabled}>
        {isEnglish ? <ArrowForwardIcon /> : <ArrowBackIcon />}
      </IconButton>
    </div>
  )
}

RegisterDayControlls.propTypes = {
  date: PropTypes.string.isRequired,
  isEnglish: PropTypes.bool.isRequired,
  onPreviousDay: PropTypes.func.isRequired,
  onNextDay: PropTypes.func.isRequired,
  isPreviousDisabled: PropTypes.bool.isRequired,
  isNextDisabled: PropTypes.bool.isRequired,
}
