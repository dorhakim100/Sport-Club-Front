import { useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import IconButton from '@mui/material/IconButton'
import { smoothScroll } from '../services/util.service'
import { useEffect, useState } from 'react'

export function ItemNavigation({ item, type, lastPage, isEdit }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const navigate = useNavigate()
  const location = useLocation()

  const [isDisabledFirst, setIsDisabledFirst] = useState(false)
  const [isDisabledSecond, setIsDisabledSecond] = useState(false)

  useEffect(() => {
    const setDisabled = () => {
      if (item.prevNext.next === item._id) {
        setIsDisabledFirst(true)
      }
      if (item.prevNext.prev === item._id) {
        setIsDisabledSecond(true)
      }
    }
    setDisabled()
  }, [location])

  const handleNavigationFirst = (event) => {
    if (isDisabledFirst) {
      return
    }

    const navTo = prefs.isEnglish
      ? `/${type}/${item.prevNext.prev}`
      : `/${type}/${item.prevNext.next}`

    // support for safari browsers
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate(navTo)
    }, 300) // Adjust time based on your smoothScroll timing
    return
  }
  const handleNavigationSecond = (event) => {
    if (isDisabledSecond) {
      return
    }

    const navTo = prefs.isEnglish
      ? `/${type}/${item.prevNext.next}`
      : `/${type}/${item.prevNext.prev}`

    // support for safari browsers
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate(navTo)
    }, 300) // Adjust time based on your smoothScroll timing
    return
  }

  return (
    <div className='navigation-container' style={{ direction: 'ltr' }}>
      <IconButton
        aria-label='delete'
        onClick={() => {
          navigate(lastPage)
        }}
      >
        <KeyboardReturnIcon sx={{ color: prefs.isDarkMode && 'white' }} />
      </IconButton>

      {isEdit &&
        user &&
        user.isAdmin &&
        location.pathname !== `/admin/message/${item._id}` && (
          <Link
            to={`/${type}/edit/${item._id}`}
            className='link'
            onClick={smoothScroll}
          >
            {prefs.isEnglish ? 'Edit' : 'עריכה'}
          </Link>
        )}
      <ButtonGroup variant='contained' aria-label='Basic button group'>
        <Button disabled={isDisabledFirst} onClick={handleNavigationFirst}>
          <NavigateBeforeIcon></NavigateBeforeIcon>
        </Button>

        <Button disabled={isDisabledSecond} onClick={handleNavigationSecond}>
          <NavigateNextIcon></NavigateNextIcon>
        </Button>
      </ButtonGroup>
    </div>
  )
}
