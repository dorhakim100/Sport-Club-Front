import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ToggleButton, ToggleButtonGroup, Typography, Box } from '@mui/material'
import { format, addDays, startOfWeek } from 'date-fns'
import { he } from 'date-fns/locale'

import dayjs from 'dayjs'
import { makeId } from '../services/util.service'
import { capitalizeFirstLetter } from '../services/util.service'

import { TrainerSelect } from './TrainerSelect'

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker'
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker'

import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

export function DaySelector({ editClass, setEditClass, trainers }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const [selectedDays, setSelectedDays] = useState([])

  // Generate the days of the week, starting from the current week's beginning
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 0 }) // Adjust `weekStartsOn` if needed
  const weekDays = Array.from({ length: 7 }).map((_, index) =>
    addDays(startOfCurrentWeek, index)
  )

  const [editOccur, setEditOccur] = useState()

  const handleDayChange = (event, newSelectedDay) => {
    const id = makeId()

    const dayString = newSelectedDay.toString()

    const array = dayString.split(' ')

    const dayAbbr = dayString.split(' ')[0].toLowerCase()

    const days = {
      mon: 'monday',
      tue: 'tuesday',
      wed: 'wednesday',
      thu: 'thursday',
      fri: 'friday',
      sat: 'saturday',
      sun: 'sunday',
    }

    const fullDay = days[dayAbbr]

    const occurToPush = {
      id,
      day: fullDay,
      from: '17:30',
      to: '18:30',
      time: dayString,
      isActive: true,
      trainer: {
        id: '',
        name: {
          he: '',
          eng: '',
        },
      },
    }
    setEditOccur({ ...occurToPush })
    editClass.occurrences.push(occurToPush)
    setEditClass({ ...editClass })
    selectedDays.push({ ...occurToPush })
    setSelectedDays([...selectedDays])
  }

  function getNextDateWithDayAndTime(day, time = '00:00') {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const dayIndex = daysOfWeek.indexOf(day)

    if (dayIndex === -1) throw new Error('Invalid day provided')

    const [hour, minute] = time.split(':').map(Number)
    console.log(time)
    const today = new Date()
    let resultDate = new Date(today)

    // Calculate how many days to add to get the next occurrence of the day
    let daysToAdd = (dayIndex - today.getDay() + 7) % 7
    if (
      daysToAdd === 0 &&
      (hour < today.getHours() ||
        (hour === today.getHours() && minute <= today.getMinutes()))
    ) {
      daysToAdd = 7 // If today is the correct day but time has passed, set to next week
    }

    resultDate.setDate(today.getDate() + daysToAdd)
    resultDate.setHours(hour, minute, 0, 0)

    console.log(resultDate)

    return resultDate // Returns in the desired format
  }

  useEffect(() => {
    const { occurrences } = editClass
    console.log(occurrences)
    const daysToSet = occurrences.map((occur) => {
      console.log(occur)
      const dayToSet = {
        id: occur.id,
        time: getNextDateWithDayAndTime(
          capitalizeFirstLetter(occur.day),
          occur.from || '00:00'
        ),
        from: occur.from || '',
        to: occur.to || '',
        trainer: occur.trainer,
        day: occur.day,
        isActive: occur.isActive,
      }
      return dayToSet
    })
    console.log(daysToSet)
    setSelectedDays(daysToSet)
  }, [editClass.occurrences])

  const onRemoveClass = (idToRemove) => {
    const newOccurrences = editClass.occurrences.filter(
      (occur) => occur.id !== idToRemove
    )
    setEditClass({ ...editClass, occurrences: newOccurrences })
  }

  //   const handleTimeChange = (ev, type, occurId) => {
  //     const date = new Date(ev.$d)
  //     const timeString = date.toLocaleTimeString([], {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       hour12: false,
  //     })

  //     let newOccur
  //     if (editClass.occurrences.some((occur) => occur.id === occurId)) {
  //       const idx = editClass.occurrences.findIndex(
  //         (occurrence) => occurrence.id === occurId
  //       )
  //       const occur = editClass.occurrences.find(
  //         (occurrence) => occurrence.id === occurId
  //       )

  //       newOccur = { ...occur, [type]: timeString }
  //       editClass.occurrences.splice(idx, 1, newOccur)
  //     } else {
  //       newOccur = { ...editOccur, [type]: timeString }
  //       editClass.occurrences.push({ ...newOccur })
  //     }

  //     console.log(newOccur)
  //     console.log({ ...editClass })
  //     setEditClass({ ...editClass })
  //   }

  const handleTimeChange = (ev, type, occurId) => {
    const date = new Date(ev.$d)
    const timeString = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    // Check if the occurrence with occurId already exists
    const occurrenceExists = editClass.occurrences.some(
      (occur) => occur.id === occurId
    )

    // Create updated occurrences array without mutating the original
    const updatedOccurrences = occurrenceExists
      ? editClass.occurrences.map((occur) =>
          occur.id === occurId ? { ...occur, [type]: timeString } : occur
        )
      : [
          ...editClass.occurrences,
          { ...editOccur, id: occurId, [type]: timeString },
        ]

    // Set the updated occurrences into editClass
    setEditClass((prevEditClass) => ({
      ...prevEditClass,
      occurrences: updatedOccurrences,
    }))

    console.log({ ...editClass, occurrences: updatedOccurrences })
  }

  const handleActiveChange = (occurToEdit) => {
    const { id } = occurToEdit
    const idx = editClass.occurrences.findIndex((occur) => occur.id === id)
    console.log(idx)
    let stateToSet = occurToEdit.isActive
    stateToSet = !stateToSet
    console.log(stateToSet)
    editClass.occurrences.splice(idx, 1, {
      ...occurToEdit,
      isActive: stateToSet,
    })
    console.log(editClass.occurrences)
    const newOccurrences = [...editClass.occurrences]
    setEditClass((prevEditClass) => ({
      ...prevEditClass,
      occurrences: newOccurrences,
    }))
  }

  return (
    <Box textAlign='center'>
      <ToggleButtonGroup
        color='primary'
        value={selectedDays}
        exclusive
        onChange={handleDayChange}
        aria-label='Day selection'
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        {weekDays.map((day) => (
          <ToggleButton
            key={day.toISOString()}
            value={day}
            style={{ minWidth: '45px', padding: '8px' }}
          >
            <Box>
              <Typography variant='body2'>
                {' '}
                {prefs.isEnglish
                  ? format(day, 'EEE') // Returns the full name of the day in English, e.g., "Friday"
                  : format(day, 'EEEE', { locale: he }).replace(/יום\s*/, '')}
              </Typography>
              {/* <Typography variant='caption'>{format(day, 'dd/MM')}</Typography> */}
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {selectedDays &&
        selectedDays.map((day) => {
          return (
            <div className='occur-container' key={day.id}>
              {/* <Typography variant='body1' style={{ marginTop: '16px' }}> */}
              <b>
                {prefs.isEnglish
                  ? format(day.time, 'EEEE') // Returns the full name of the day in English, e.g., "Friday"
                  : format(day.time, 'EEEE', { locale: he })}
              </b>
              {/* </Typography> */}
              <div
                className='times-container'
                style={{
                  display: 'flex',
                  gap: '1em',
                  alignItems: 'center',
                  justifyItems: 'center',
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoItem label={prefs.isEnglish ? 'From' : 'משעה'}>
                    <MobileTimePicker
                      ampm={false}
                      defaultValue={dayjs('2022-04-17T17:30')}
                      onChange={(event) =>
                        handleTimeChange(event, 'from', day.id)
                      }
                      value={
                        day.from
                          ? dayjs(`2022-04-17T${day.from}`)
                          : dayjs(`2022-04-17T17:30`)
                      }
                    />
                  </DemoItem>

                  <DemoItem label={prefs.isEnglish ? 'To' : 'עד השעה'}>
                    <MobileTimePicker
                      ampm={false}
                      defaultValue={dayjs('2022-04-17T18:30')}
                      onChange={(event) =>
                        handleTimeChange(event, 'to', day.id)
                      }
                      value={
                        day.to
                          ? dayjs(`2022-04-17T${day.to}`)
                          : dayjs(`2022-04-17T18:30`)
                      }
                    />
                  </DemoItem>
                </LocalizationProvider>{' '}
                <IconButton
                  aria-label='delete'
                  style={{ alignSelf: 'end' }}
                  onClick={() => onRemoveClass(day.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              <TrainerSelect
                prefs={prefs}
                trainers={trainers}
                editClass={editClass}
                setEditClass={setEditClass}
                editOccur={editOccur}
                setEditOccur={setEditOccur}
                id={day.id}
                occur={day}
              />
              <div className='input-container active'>
                <div
                  className={`checkbox-container ${
                    prefs.isDarkMode && 'dark-mode'
                  }`}
                  style={{ gridColumn: '1/-1' }}
                >
                  <label htmlFor={`isActive${day.id}`}>
                    {prefs.isEnglish ? 'Active' : 'פעיל'}
                  </label>
                  <input
                    type='checkbox'
                    name=''
                    id={`isActive${day.id}`}
                    // checked={true}
                    checked={day.isActive}
                    onChange={() => {
                      handleActiveChange(day)
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
    </Box>
  )
}
