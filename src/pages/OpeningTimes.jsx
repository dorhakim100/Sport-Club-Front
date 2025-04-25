import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { makeId } from '../services/util.service'

import { HeadContainer } from '../cmps/HeadContainer'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { ContactUs } from '../cmps/ContactUs'
import { Button } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

import { Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'
import { set } from 'date-fns'

import dayjs from 'dayjs'
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'
import { openingService } from '../services/opening/opening.service'

export function OpeningTimes() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const text = { he: 'שעות הפתיחה', eng: 'Opening Times' }
  const [days, setDays] = useState(getDefaultTimes())

  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const [isEdit, setIsEdit] = useState(false)
  const [isEditModal, setIsEditModal] = useState(false)

  const [editDay, setEditDay] = useState(getEmptyDay())
  const isLoading = useSelector(
    (stateSelector) => stateSelector.systemModule.isLoading
  )

  const tableRef = useRef()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const getDays = async () => {
      try {
        setIsLoading(true)
        const d = await openingService.query()
        setDays(d)
      } catch (error) {
        console.log(error)
        showErrorMsg(
          prefs.isEnglish ? 'Error fetching times' : 'שגיאה בטעינת השעות'
        )
      } finally {
        setIsLoading(false)
      }
    }
    getDays()
  }, [isEdit])

  useEffect(() => {
    const handleScroll = () => {
      // Detecting scroll direction based on language preference
      let scrollPos

      if (prefs.isEnglish) {
        scrollPos = tableRef.current.scrollLeft
        setIsScrolled(scrollPos > 0)
      } else {
        scrollPos = tableRef.current.scrollLeft

        setIsScrolled(scrollPos < 1)
      }
    }
    tableRef.current.addEventListener('scroll', handleScroll)
  }, [setIsScrolled, prefs.isEnglish])

  const onEditTime = (dayId, facility, index) => {
    const day = days.find((day) => day._id === dayId)
    setEditDay(day)
    setIsEdit(true)
    setIsEditModal(true)
  }

  const onDeleteTime = (dayId, facilityName, index) => {
    const day = days.find((day) => day._id === dayId)
    const dayToSet = {
      ...day,
      times: {
        ...day.times,
        [facilityName]: [
          ...day.times[facilityName].filter((time, idx) => idx !== index),
        ],
      },
    }
    setDays(
      days.map((day) => {
        if (day._id === dayId) {
          return dayToSet
        } else return day
      })
    )

    setEditDay(getEmptyDay())
    // setHolidayText(null)
  }

  const handleHolidayChange = (dayId, value) => {
    let key
    let otherKey
    let holidayToSet
    prefs.isEnglish ? (key = 'eng') : (key = 'he')
    prefs.isEnglish ? (otherKey = 'he') : (otherKey = 'eng')

    const day = days.find((day) => day._id === dayId)

    if (!day.extra || !day.extra[otherKey] || day.extra[otherKey] === '') {
      day.extra = {}
      day.extra[otherKey] = value
    }

    const dayToSet = {
      ...day,
      extra: {
        ...day.extra,
        [key]: value,
      },
    }

    setDays((prevDays) =>
      prevDays.map((day) => (day._id === dayId ? dayToSet : day))
    )
  }

  function getEmptyDay() {
    return {
      _id: makeId(),
      dayName: {
        he: '',
        eng: '',
      },
      extra: null,
      times: {
        pool: [
          {
            from: '',
            to: '',
          },
        ],
        gym: [
          {
            from: '',
            to: '',
          },
        ],
      },
    }
  }

  const onAddTime = (dayId, facilityName) => {
    const day = days.find((day) => day._id === dayId)

    const idx = day.times[facilityName].length

    const dayToSet = {
      ...day,
      times: {
        ...day.times,
        [facilityName]: [
          ...day.times[facilityName],
          { from: '00:00', to: '00:00' },
        ],
      },
    }

    setDays(
      days.map((day) => {
        if (day._id === dayId) {
          return dayToSet
        } else return day
      })
    )

    // setIsEdit(true)
  }

  const handleTimeChange = (newValue, type, day, facilityName, index) => {
    const newTime = newValue.format('HH:mm')

    const newFacilityTimes = [...day.times[facilityName]]

    newFacilityTimes[index] = {
      ...newFacilityTimes[index],
      [type]: newTime,
    }

    day.times[facilityName] = newFacilityTimes

    const dayToSet = {
      ...day,
    }
    setDays((prevDays) =>
      prevDays.map((d) => (d._id === day._id ? dayToSet : d))
    )
  }

  const onSaveTimes = async () => {
    try {
      setIsLoading(true)
      const formattedDays = days.map((day) => {
        if (!day.extra) day.extra = null
        if (day.extra && day.extra.he === '' && day.extra.eng === '') {
          day.extra = null
        }
        return day
      })

      const updatedTimes = await openingService.save(formattedDays)
      showSuccessMsg(prefs.isEnglish ? 'Times saved' : 'שעות נשמרו בהצלחה')

      setDays([...updatedTimes])
    } catch (error) {
      console.log(error)
      showErrorMsg(
        prefs.isEnglish ? 'Error saving times' : 'שגיאה בשמירת השעות'
      )
    } finally {
      setIsLoading(false)
      setIsEdit(false)
    }
  }

  return (
    <div className='times-container'>
      <HeadContainer text={text} />
      <TableContainer component={Paper} ref={tableRef}>
        <Table
          sx={{
            backgroundColor: prefs.isDarkMode && '#263039',
            // maxWidth: '1000px',
          }}
          aria-label='simple table'
        >
          <TableHead>
            <TableRow>
              <TableCell
                align='center'
                key={makeId()}
                sx={{
                  color: prefs.isDarkMode && 'white',
                  borderLeft: prefs.isEnglish ? '0px' : 'transparent 1px solid',
                  borderColor: prefs.IsDarkMode ? '#fff' : '#e0e0e0',
                }}
              >
                {user && user.isAdmin && (
                  <LoadingButton
                    variant='contained'
                    loading={isLoading}
                    onClick={() => {
                      if (isEdit) {
                        onSaveTimes()
                      } else {
                        setIsEdit(true)
                      }
                    }}
                    sx={{
                      '&.MuiLoadingButton-loading': {
                        backgroundColor:
                          prefs.isDarkMode && 'rgba(255, 255, 255, 0.12)',

                        '.css-1oup2s-MuiLoadingButton-loadingIndicator': {
                          color: prefs.isDarkMode && 'white',
                        },
                      },
                    }}
                  >
                    {isEdit
                      ? prefs.isEnglish
                        ? 'Save'
                        : 'שמור'
                      : prefs.isEnglish
                      ? 'Edit'
                      : 'עריכה'}
                  </LoadingButton>
                )}
              </TableCell>

              {days.map((day, index) => {
                if (day.dayName)
                  return (
                    <TableCell
                      align='center'
                      key={makeId()}
                      sx={{
                        color: prefs.isDarkMode && 'white',
                        borderLeft: '0px',
                        borderRight:
                          index === (prefs.isEnglish ? days.length - 1 : 0)
                            ? '0px'
                            : 'transparent 1px solid',
                        borderColor: prefs.IsDarkMode ? '#fff' : '#e0e0e0',
                      }}
                    >
                      <div
                        className={`day-title-container ${
                          isEdit ? 'edit-mode' : ''
                        }`}
                      >
                        <b>
                          {prefs.isEnglish ? day.dayName.eng : day.dayName.he}
                        </b>
                        {!isEdit && (
                          <b>
                            {day.extra &&
                              day.extra[prefs.isEnglish ? 'eng' : 'he'] !== ''}
                            {day.extra
                              ? day.extra[prefs.isEnglish ? 'eng' : 'he']
                                ? day.extra[prefs.isEnglish ? 'eng' : 'he']
                                : ''
                              : ''}
                          </b>
                        )}

                        {user && user.isAdmin && isEdit && (
                          <HolidayInput
                            day={day}
                            onUpdate={handleHolidayChange}
                          />
                        )}
                      </div>
                    </TableCell>
                  )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={makeId()}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <TableCell
                component='th'
                scope='row'
                align='center'
                sx={{
                  color: prefs.isDarkMode && 'white',
                  borderLeft: prefs.isEnglish ? '0px' : 'transparent 1px solid',
                  borderColor: prefs.IsDarkMode ? '#fff' : '#e0e0e0',
                }}
                className={`facility-cell ${prefs.isDarkMode && 'dark-mode'} ${
                  isScrolled ? 'scrolled' : ''
                }`}
              >
                <b>{prefs.isEnglish ? 'Pool' : 'בריכה'}</b>
              </TableCell>
              {days.map((day, index) => {
                let facilityName = 'pool'
                return (
                  <TableCell
                    component='th'
                    scope='row'
                    align='center'
                    key={makeId()}
                    sx={{
                      color: prefs.isDarkMode && 'white',
                      borderLeft: '0px',
                      borderRight:
                        index === (prefs.isEnglish ? days.length - 1 : 0)
                          ? '0px'
                          : 'transparent 1px solid',
                      borderColor: prefs.IsDarkMode ? '#fff' : '#e0e0e0',
                      borderBottom: '0px',
                    }}
                  >
                    {day.times.pool.map((time, index) => {
                      return (
                        <div className='hour-container' key={index}>
                          {isEdit ? (
                            <>
                              <AdminButtons
                                onEditTime={onEditTime}
                                onDeleteTime={onDeleteTime}
                                day={day}
                                facilityName={facilityName}
                                index={index}
                              />
                              <CustomTimePicker
                                from={time.from}
                                to={time.to}
                                day={day}
                                facilityName={facilityName}
                                index={index}
                                handleTimeChange={handleTimeChange}
                              />
                            </>
                          ) : (
                            <div
                              align='center'
                              style={{
                                display: 'grid',
                                color: prefs.isDarkMode && 'white',
                                borderBottom: 'none',
                                padding: '0px',
                                paddingTop: '0.5em',
                                paddingBottom: '0.5em',
                                fontSize: '1.3em',
                              }}
                            >
                              <div className='time'>
                                <span>{time.from}</span>
                                <span>-</span>
                                <span>{time.to}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {isEdit && (
                      <AdminAddButton
                        onAddTime={onAddTime}
                        dayId={day._id}
                        facilityName={facilityName}
                      />
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
            <TableRow
              key={makeId()}
              sx={
                {
                  // '&:last-child td, &:last-child th': { border: 0 },
                }
              }
            >
              <TableCell
                component='th'
                scope='row'
                align='center'
                sx={{
                  color: prefs.isDarkMode && 'white',
                  padding: '0px',
                  paddingLeft: '0.5em',
                  paddingRight: '0.5em',
                  borderBottom: '0px',
                  borderLeft: prefs.isEnglish ? '0px' : 'transparent 1px solid',
                  borderColor: prefs.IsDarkMode ? '#fff' : '#e0e0e0',
                }}
                className={`facility-cell ${prefs.isDarkMode && 'dark-mode'} ${
                  isScrolled ? 'scrolled' : ''
                }`}
              >
                <b>{prefs.isEnglish ? 'Gym' : 'חדר הכושר'}</b>
              </TableCell>

              {days.map((day, index) => {
                let facilityName = 'gym'
                return (
                  <TableCell
                    component='th'
                    scope='row'
                    align='center'
                    key={makeId()}
                    sx={{
                      color: prefs.isDarkMode && 'white',
                      border: 'black 1px solid',
                      borderLeft: '0px',
                      borderRight:
                        index === (prefs.isEnglish ? days.length - 1 : 0)
                          ? '0px'
                          : 'transparent 1px solid',
                      borderColor: prefs.IsDarkMode ? '#fff' : '#e0e0e0',
                      borderBottom: '0px',
                    }}
                  >
                    {day.times.gym.map((time, index) => {
                      if (day.times.gym.length === 0)
                        return <b>{prefs.isEnglish ? 'Closed' : 'סגור'}</b>
                      else
                        return (
                          <div className='hour-container' key={index}>
                            {isEdit ? (
                              <>
                                <AdminButtons
                                  onEditTime={onEditTime}
                                  onDeleteTime={onDeleteTime}
                                  day={day}
                                  facilityName={facilityName}
                                  index={index}
                                />

                                <CustomTimePicker
                                  from={time.from}
                                  to={time.to}
                                  day={day}
                                  facilityName={facilityName}
                                  index={index}
                                  handleTimeChange={handleTimeChange}
                                />
                              </>
                            ) : (
                              <div
                                align='center'
                                style={{
                                  display: 'grid',
                                  color: prefs.isDarkMode && 'white',
                                  borderBottom: 'none',
                                  fontSize: '1.3em',
                                }}
                              >
                                <div className='time'>
                                  <span>{time.from}</span>
                                  <span>-</span>
                                  <span>{time.to}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                    })}

                    {isEdit && (
                      <AdminAddButton
                        onAddTime={onAddTime}
                        dayId={day._id}
                        facilityName={facilityName}
                      />
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <ContactUs />
    </div>
  )
}

function CustomTimePicker({
  from,
  to,
  day,
  facilityName,
  index,
  handleTimeChange,
}) {
  const fromTime = dayjs(`2022-04-17T${from}`)
  const toTime = dayjs(`2022-04-17T${to}`)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const defaultTimePickerStyles = {
    // Targets the input element's container – adjust border and hover effects
    '& .MuiOutlinedInput-root': {
      border: prefs.isDarkMode
        ? '1px solid rgba(255,255,255,0.6)'
        : '1px solid #ccc',
      borderRadius: '4px',
      // Hover effect: change border color upon hover
      '&:hover': {
        borderColor: prefs.isDarkMode ? 'rgba(255,255,255,0.9)' : '#888',
      },
    },
    // Targets the inner input text color
    '& .MuiInputBase-input': {
      color: prefs.isDarkMode ? 'white' : 'inherit',
    },
    // Targets icons like the clock icon in the picker
    '& .MuiSvgIcon-root': {
      color: prefs.isDarkMode ? 'white' : 'inherit',
    },
    // When the calendar popover appears, style the Paper component
    '& .MuiPaper-root': {
      backgroundColor: prefs.isDarkMode ? '#424242' : 'inherit',
      color: prefs.isDarkMode ? 'white' : 'inherit',
    },
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='from-to-container'>
        <MobileTimePicker
          defaultValue={fromTime}
          ampmInClock={true}
          ampm={false}
          sx={defaultTimePickerStyles}
          onChange={(newValue) => {
            handleTimeChange(newValue, 'from', day, facilityName, index)
          }}
        />

        <span>-</span>

        <MobileTimePicker
          defaultValue={toTime}
          ampmInClock={true}
          ampm={false}
          sx={defaultTimePickerStyles}
          onChange={(newValue) => {
            handleTimeChange(newValue, 'to', day, facilityName, index)
          }}
        />
      </div>
    </LocalizationProvider>
  )
}

function AdminButtons({ onEditTime, onDeleteTime, day, index, facilityName }) {
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  if (user && user.isAdmin)
    return (
      <>
        <IconButton
          onClick={() => onDeleteTime(day._id, facilityName, index)}
          sx={{
            color: prefs.isDarkMode && 'white',

            '&:hover': {
              backgroundColor: prefs.isDarkMode && 'rgba(223, 249, 255, 0.1)',
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </>
    )
}

function AdminAddButton({ onAddTime, dayId, facilityName }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  if (user && user.isAdmin)
    return (
      <Button
        variant='contained'
        color='success'
        sx={{
          width: '100%',
        }}
        onClick={() => onAddTime(dayId, facilityName)}
      >
        <AddCircleOutlineIcon />
      </Button>
    )
}

function HolidayInput({ day, onUpdate }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  // We store the input value locally
  const [localValue, setLocalValue] = React.useState(
    day.extra ? day.extra[prefs.isEnglish ? 'eng' : 'he'] : ''
  )

  // Handle immediate input value change
  const handleInputChange = (e) => {
    setLocalValue(e.target.value)
  }

  // When input loses focus, update the global state
  const handleBlur = () => {
    onUpdate(day._id, localValue)
  }

  return (
    <div
      className={
        prefs.isDarkMode ? 'input-container dark-mode' : 'input-container'
      }
      style={{
        direction: prefs.isEnglish ? 'ltr' : 'rtl',
      }}
    >
      <input
        type='search'
        value={localValue}
        data-custom={day._id}
        onChange={handleInputChange}
        placeholder={prefs.isEnglish ? 'Holiday' : 'חג'}
        onBlur={handleBlur}
      />
    </div>
  )
}

function getDefaultTimes() {
  return [
    {
      _id: makeId(),
      dayName: {
        he: 'ראשון',
        eng: 'Sunday',
      },
      extra: null,
      times: {
        pool: [
          {
            from: '06:00',
            to: '13:00',
          },
          {
            from: '15:00',
            to: '21:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '13:00',
          },
          {
            from: '16:00',
            to: '21:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'שני',
        eng: 'Monday',
      },
      extra: null,
      times: {
        pool: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'שלישי',
        eng: 'Tuesday',
      },
      extra: null,

      times: {
        pool: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'רביעי',
        eng: 'Wednesday',
      },
      extra: null,

      times: {
        pool: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'חמישי',
        eng: 'Thursday',
      },
      extra: null,

      times: {
        pool: [
          {
            from: '06:00',
            to: '21:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '13:00',
          },
          {
            from: '16:00',
            to: '21:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'שישי',
        eng: 'Friday',
      },
      extra: null,

      times: {
        pool: [
          {
            from: '06:00',
            to: '17:00',
          },
        ],
        gym: [
          {
            from: '06:00',
            to: '16:00',
          },
        ],
      },
    },
    {
      _id: makeId(),
      dayName: {
        he: 'שבת',
        eng: 'Saturday',
      },
      extra: null,

      times: {
        pool: [
          {
            from: '08:00',
            to: '17:00',
          },
        ],
        gym: [
          {
            from: '08:00',
            to: '16:00',
          },
        ],
      },
    },
  ]
}
