import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { smoothScroll } from '../services/util.service'
import FormControlLabel from '@mui/material/FormControlLabel'

import Switch from '@mui/material/Switch'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { showErrorMsg } from '../services/event-bus.service'
import { updateUser } from '../store/actions/user.actions'
import dayjs from 'dayjs'

const emptyProfile =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

export function UserPreview({ user, handleMemberChange }) {
  //   console.log(user)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()

  const navigateToUser = (event) => {
    if (
      event.target.closest('.switch-container') ||
      event.target.closest('.date-picker-container') ||
      event.target.closest('.MuiPopper-root')
    )
      return
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate(`/user/${user._id}`)
    }, 300) // Adjust time based on your smoothScroll timing
  }

  const handleOnMemberChange = async (event) => {
    let status
    if (!user.memberStatus || !user.memberStatus.isMember) status = false
    else status = true
    try {
      status = !status
      const userToUpdate = {
        ...user,
        memberStatus: user.memberStatus
          ? { ...user.memberStatus, isMember: status }
          : { isMember: status, expiry: '' },
      }
      await handleMemberChange(userToUpdate)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't update user` : 'לא היה ניתן לערוך משתמש'
      )
    }
  }

  return (
    <div className={`list-item-container user`} onClick={navigateToUser}>
      <div className='img-container'>
        <img src={user.imgUrl || emptyProfile} alt='' />
      </div>
      <b>{user.fullname}</b>

      <div className='switch-container'>
        <FormControlLabel
          control={
            <Switch
              checked={user.memberStatus && user.memberStatus.isMember}
              color={prefs.isDarkMode ? 'secondary' : 'primary'}
              onChange={handleOnMemberChange}
              sx={{
                '.MuiSwitch-colorSecondary': {
                  color: 'white',
                },
              }}
            />
          }
          label={prefs.isEnglish ? 'Member' : 'מנוי'}
        />
      </div>
      {user.memberStatus && user.memberStatus.isMember && (
        <div className='date-picker-container'>
          <div
            className={`member-indicator ${
              user?.memberStatus.expiry > Date.now() ? 'active' : 'not-active'
            }`}
          ></div>
          <MemberDatePicker
            handleMemberChange={handleMemberChange}
            user={user}
          />
        </div>
      )}
    </div>
  )
}

function MemberDatePicker({ handleMemberChange, user }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const handleDateChange = async (event) => {
    try {
      const { $D: day, $M: month, $y: year } = event
      const date = `${day}/${month}/${year}`
      const utcDate = Date.UTC(year, month, day)

      const userToUpdate = {
        ...user,
        memberStatus: { isMember: true, expiry: utcDate },
      }

      await handleMemberChange(userToUpdate)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Couldn't update user` : 'לא היה ניתן לעדכן משתמש'
      )
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={['DatePicker']}
        sx={{
          direction: prefs.isEnglish ? 'ltr' : 'rtl',
        }}
      >
        <DatePicker
          //   label={prefs.isEnglish ? 'Member expiry' : 'תוקף המנוי'}
          onChange={handleDateChange}
          format='DD/MM/YYYY'
          value={dayjs(user.memberStatus.expiry)}
          sx={{
            direction: prefs.isEnglish ? 'ltr' : 'rtl',
            color: prefs.isDarkMode ? 'white' : '',

            '& button': {
              color: prefs.isDarkMode ? 'white' : '',
            },
            '& input': {
              color: prefs.isDarkMode ? 'white' : '',
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  )
}
