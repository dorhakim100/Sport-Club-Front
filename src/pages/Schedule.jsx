import React, { useState, useEffect } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { classService } from '../services/class/class.service'
import { uploadService } from '../services/upload.service'
import { setIsLoading } from '../store/actions/system.actions'
import {
  capitalizeFirstLetter,
  translateDayToHebrew,
} from '../services/util.service'

import { Nav } from '../cmps/Nav'

import { styled } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import { containerClasses } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { HeadContainer } from '../cmps/HeadContainer'
import { makeId } from '../services/util.service'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import BedtimeIcon from '@mui/icons-material/Bedtime'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

export function Schedule() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const isLoading = useSelector(
    (storeState) => storeState.systemModule.isLoading
  )

  const [occurrs, setOccurrs] = useState([])

  const [schedules, setSchedules] = useState([])
  const [schedule, setSchedule] = useState({})

  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const [filter, setFilter] = useState({ pageIds: 0, isAll: false })

  const daysOfWeek = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    // 'saturday',
  ]

  useEffect(() => {
    loadSchedules()
    loadOccurrences()
  }, [])

  const loadSchedules = async () => {
    try {
      const schedules = await scheduleService.query(filter)
      setSchedules((prev) => (prev = schedules))
      setSchedule({ ...schedules[schedules.length - 1] })
      return schedules
    } catch (err) {
      console.log(err)
    }
  }

  const loadOccurrences = async () => {
    setIsLoading(true)
    try {
      const occurrences = await classService.getOccurrences()

      setOccurrs(occurrences)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't load schedule` : 'טעינת מערכת נכשלה'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function uploadFile(ev) {
    setIsLoading(true)
    try {
      const res = await uploadService.uploadImg(ev)
      const coverSrc = res.url
      const saved = await scheduleService.save(coverSrc)
      // setSchedule(saved)
      const newSchedules = await loadSchedules()

      setSchedule({ ...saved })
    } catch (err) {
      console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't upload image` : 'העלאת תמונה נכשלה'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const origin = {
    path: '/class',
    he: 'שיעורים',
    eng: 'Class',
  }

  const links = [
    {
      path: '/class/schedule',
      he: 'לוח החוגים',
      eng: 'Schedule',
    },
    {
      path: '/class/trainer',
      he: 'המדריכים שלנו',
      eng: 'Our Instructors',
    },
  ]

  function getFromTime(from) {
    const array = from.split(':')
    let hour = array[0]
    hour = +hour
    let state
    if (hour >= 14) {
      state = 'evening'
    }
    if (hour < 14) {
      state = 'morning'
    }
    return state
  }

  return (
    <section className='schedule'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <Nav origin={origin} links={links} />

      <HeadContainer text={{ he: 'מערכת החוגים', eng: 'Schedule' }} />

      <div className='icons-container'>
        <div className='icon-container'>
          <b>{prefs.isEnglish ? 'Morning' : 'בוקר'}</b>
          <b>-</b>
          <div className='icon morning'>
            <WbSunnyIcon />
          </div>
        </div>
        <div className='icon-container'>
          <b>{prefs.isEnglish ? 'Evening' : 'ערב'}</b>
          <b>-</b>
          <div className='icon evening'>
            <BedtimeIcon />
          </div>
        </div>
      </div>
      <div
        className={`schedule-container ${prefs.isEnglish ? '' : 'rtl'} ${
          prefs.isDarkMode ? 'dark-mode' : ''
        }`}
      >
        {daysOfWeek.map((day) => {
          let counter = [1, 2, 3, 4, 5, 6]
          // counter.length = 5
          return (
            <div className='day-container' key={`${makeId()}${day}`}>
              <div className='hour-container day'>
                <b>
                  {prefs.isEnglish
                    ? capitalizeFirstLetter(day)
                    : translateDayToHebrew(day)}
                </b>
              </div>
              {occurrs.map((occur) => {
                return (
                  occur.day === day && (
                    <div
                      className={`hour-container ${getFromTime(occur.from)}`}
                    >
                      <div className='occurrence-container'>
                        <b>
                          {prefs.isEnglish ? occur.title.eng : occur.title.he}
                        </b>
                        <span
                          className='time-container'
                          style={{ direction: 'ltr' }}
                        >{`${occur.from}-${occur.to}`}</span>
                        <span>
                          {prefs.isEnglish
                            ? occur.trainer.name.eng
                            : occur.trainer.name.he}
                        </span>
                        <div className='icon'>
                          {(getFromTime(occur.from) === 'morning' && (
                            <WbSunnyIcon />
                          )) || <BedtimeIcon />}
                        </div>
                      </div>
                    </div>
                  )
                )
              })}
              {/* {counter.map((count) => {
                console.log(occurrs)
                return occurrs.map((occur, index, array) => {
                  console.log(index)
                  if (occur.day === day) {
                    // array.splice(index, 1)
                    return (
                      <div className='hour-container'>
                        <b>
                          {prefs.isEnglish ? occur.title.eng : occur.title.he}
                        </b>
                        <span>
                          {prefs.isEnglish
                            ? occur.trainer.name.eng
                            : occur.trainer.name.he}
                        </span>
                        <span
                          style={{ direction: 'ltr' }}
                        >{`${occur.from}-${occur.to}`}</span>
                      </div>
                    )
                  } else {
                    return (
                      <div className='hour-container'>
                        <span>1</span>
                        <span>1</span>
                        <span>1</span>
                      </div>
                    )
                  }
                })

              })} */}
              {/* <div className='hour-container'>{counter++}</div>
              <div className='hour-container'>{counter++}</div>
              <div className='hour-container'>{counter++}</div>
              <div className='hour-container'>{counter++}</div>
              <div className='hour-container'>{counter++}</div>
              <div className='hour-container'>{counter++}</div> */}
            </div>
          )
        })}
      </div>

      {/* {
        <div className='schedule-img-container' key={schedule._id}>
          <img src={schedule.link} alt='' />
        </div>
      } */}
      {/* {user && user.isAdmin && (
        <div className='control-container'>
          <LoadingButton
            component='label'
            role={undefined}
            variant='contained'
            tabIndex={-1}
            startIcon={<CloudUploadIcon sx={{ ml: 1 }} />}
            loading={isLoading}
          >
            Upload file
            <VisuallyHiddenInput type='file' onChange={uploadFile} />
          </LoadingButton>
        </div>
      )} */}
    </section>
  )
}
