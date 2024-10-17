import React, { useState, useEffect } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { scheduleService } from '../services/schedule/schedule.service'
import { uploadService } from '../services/upload.service'
import { setIsLoading } from '../store/actions/system.actions'

import { styled } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import { containerClasses } from '@mui/material'
import { LoadingButton } from '@mui/lab'

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

  const [schedules, setSchedules] = useState([])
  const [schedule, setSchedule] = useState({})

  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const [filter, setFilter] = useState({ pageIds: 0, isAll: false })

  useEffect(() => {
    loadSchedules()
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
      showErrorMsg(`Couldn't upload image`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='schedule-container'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <nav className='page-navigation-container'>
        <NavLink to='/class/schedule'>
          {prefs.isEnglish ? 'Schedule' : 'לוח החוגים'}
        </NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='/class/trainer'>
          {prefs.isEnglish ? 'Our Instructors' : 'המדריכים שלנו'}
        </NavLink>
      </nav>
      <div className='head-container'>
        <h3>
          <span
            style={
              prefs.isDarkMode
                ? { backgroundColor: '#2C3E50' }
                : { backgroundColor: '#F5F5F5' }
            }
          >
            {prefs.isEnglish ? 'Schedule' : 'מערכת החוגים'}
          </span>
        </h3>
      </div>{' '}
      {
        <div className='schedule-img-container' key={schedule._id}>
          <img src={schedule.link} alt='' />
        </div>
      }
      {user && user.isAdmin && (
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
      )}
    </section>
  )
}
