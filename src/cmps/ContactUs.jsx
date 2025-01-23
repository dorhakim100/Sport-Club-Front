import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { messageService } from '../services/message/message.service'
import { socketService } from '../services/socket.service'
import { addMessage } from '../store/actions/message.actions'
import { smoothScroll } from '../services/util.service'

import { SOCKET_EMIT_SEND_MSG } from '../services/socket.service'

import { HeadContainer } from './HeadContainer'

import { LoadingButton } from '@mui/lab'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

export function ContactUs() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const navigate = useNavigate()
  const location = useLocation()

  const [editMessage, setEditMessage] = useState(
    messageService.getEmptyMessage()
  )

  useEffect(() => {
    if (user && !user.isAdmin) {
      setEditMessage({ ...editMessage, name: user.fullname })
    } else {
      const newM = messageService.getEmptyMessage()

      setEditMessage({ ...newM })
    }
  }, [user])

  function handleChange({ target }) {
    const field = target.name
    const value = target.value

    setEditMessage({ ...editMessage, [field]: value })
  }

  async function onSend() {
    delete editMessage._id
    try {
      setIsLoading(true)
      const addedMessage = await addMessage(editMessage)

      showSuccessMsg(prefs.isEnglish ? 'Message sent' : 'הודעה נשלחה')
      setEditMessage(messageService.getEmptyMessage())
      socketService.emit(SOCKET_EMIT_SEND_MSG, addedMessage)
    } catch (err) {
      // // console.log(err)
      showErrorMsg(prefs.isEnglish ? `Could't send message` : 'הודעה לא נשלחה')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigation = (event) => {
    // support for safari browsers
    event.preventDefault() // Stop the link from navigating immediately
    smoothScroll()

    setTimeout(() => {
      navigate('/about/times')
    }, 300) // Adjust time based on your smoothScroll timing
  }

  return (
    <div className='contact-us-container'>
      <HeadContainer
        text={{
          eng: 'Contact us',
          he: 'צרו קשר',
        }}
      />
      <div className='contact-cmp-container'>
        <div
          className={
            prefs.isDarkMode ? 'input-container dark-mode' : 'input-container'
          }
        >
          <input
            type='text'
            name='name'
            id=''
            placeholder={prefs.isEnglish ? 'Name' : 'שם'}
            onChange={handleChange}
            value={editMessage.name}
          />
          <input
            name='phone'
            type='tel'
            id=''
            placeholder={prefs.isEnglish ? 'Phone' : 'טלפון'}
            onChange={handleChange}
            value={editMessage.phone}
            required
            className={!prefs.isEnglish ? 'hebrew' : ''}
          />
          <input
            type='text'
            name='title'
            id=''
            placeholder={prefs.isEnglish ? 'Title' : 'כותרת'}
            onChange={handleChange}
            value={editMessage.title}
          />
          <textarea
            name='content'
            id=''
            style={{ resize: 'none' }}
            onChange={handleChange}
            value={editMessage.content}
            placeholder={prefs.isEnglish ? 'Content' : 'גוף ההודעה'}
          />
          <LoadingButton
            variant='contained'
            onClick={() => {
              if (!editMessage.phone) {
                showErrorMsg(
                  prefs.isEnglish
                    ? `Phone number is required`
                    : 'יש למלא מספר טלפון'
                )
                return
              }
              onSend()
            }}
          >
            {prefs.isEnglish ? 'Send' : 'שליחה'}
          </LoadingButton>
        </div>{' '}
        {location.pathname !== '/about/times' && (
          <div className='arrow-link-container' onClick={handleNavigation}>
            <Link
              to='/about/times'
              className={prefs.isDarkMode ? 'dark' : ''}
              onClick={handleNavigation}
            >
              {prefs.isEnglish ? 'Opening Times' : 'שעות הפתיחה'}
              {prefs.isEnglish ? (
                <ArrowForwardIosIcon className='arrow right' />
              ) : (
                <ArrowBackIosNewIcon className='arrow left' />
              )}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
