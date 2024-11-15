import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { messageService } from '../services/message/message.service'
import { socketService } from '../services/socket.service'
import { addMessage } from '../store/actions/message.actions'

import { SOCKET_EMIT_SEND_MSG } from '../services/socket.service'

import { HeadContainer } from './HeadContainer'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Message } from '@mui/icons-material'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'

export function ContactUs() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)

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
      console.log(err)
      showErrorMsg(prefs.isEnglish ? `Could't send message` : 'הודעה לא נשלחה')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='contact-us-container'>
      <HeadContainer
        text={{
          eng: 'Contact us',
          he: 'צרו קשר',
        }}
      />
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
          type='text'
          name='phone'
          id=''
          placeholder={prefs.isEnglish ? 'Phone' : 'טלפון'}
          onChange={handleChange}
          value={editMessage.phone}
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
        <LoadingButton variant='contained' onClick={() => onSend()}>
          {prefs.isEnglish ? 'Send' : 'שליחה'}
        </LoadingButton>
      </div>{' '}
    </div>
  )
}
