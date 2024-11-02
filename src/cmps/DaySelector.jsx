import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ToggleButton, ToggleButtonGroup, Typography, Box } from '@mui/material'
import { format, addDays, startOfWeek } from 'date-fns'
import { he } from 'date-fns/locale'

import dayjs from 'dayjs'
import { makeId } from '../services/util.service'

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
    selectedDays.push({ str: newSelectedDay, id })
    setSelectedDays([...selectedDays])

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
      from: '',
      to: '',
      trainer: {
        id: '',
        name: {
          he: '',
          eng: '',
        },
      },
    }
    // setEditOccur({ ...editOccur, day: fullDay, id })
    setEditOccur({ ...occurToPush })
    editClass.occurrences.push(occurToPush)
    setEditClass({ ...editClass })
  }

  useEffect(() => {
    console.log(editClass)
  }, [editClass])

  const onRemoveClass = (idToRemove) => {
    const newDays = selectedDays.filter((day) => day.id !== idToRemove)
    setSelectedDays(newDays)
  }

  const handleTimeChange = (ev, type, occurId) => {
    const date = new Date(ev.$d)
    const timeString = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const idx = editClass.occurrences.findIndex(
      (occurrence) => occurrence.id === occurId
    )
    const occur = editClass.occurrences.find(
      (occurrence) => occurrence.id === occurId
    )

    const newOccur = { ...occur, [type]: timeString }

    editClass.occurrences.splice(idx, 1, newOccur)

    setEditClass({ ...editClass })
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
              <Typography variant='body1' style={{ marginTop: '16px' }}>
                {prefs.isEnglish
                  ? format(day.str, 'EEEE') // Returns the full name of the day in English, e.g., "Friday"
                  : format(day.str, 'EEEE', { locale: he })}
              </Typography>
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
                      defaultValue={dayjs('2022-04-17T15:30')}
                      onChange={(event) =>
                        handleTimeChange(event, 'from', day.id)
                      }
                    />
                  </DemoItem>

                  <DemoItem label={prefs.isEnglish ? 'To' : 'עד השעה'}>
                    <MobileTimePicker
                      ampm={false}
                      defaultValue={dayjs('2022-04-17T15:30')}
                      onChange={(event) =>
                        handleTimeChange(event, 'to', day.id)
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
              />
            </div>
          )
        })}
    </Box>
  )
}
