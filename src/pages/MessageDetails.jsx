import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showErrorMsg } from '../services/event-bus.service'
import { loadMessage } from '../store/actions/message.actions'

import { DoneMessageButton } from '../cmps/DoneMessageButton'

import { setIsLoading } from '../store/actions/system.actions'
import { ItemNavigation } from '../cmps/ItemNavigation'
import { Divider } from '@mui/material'

export function MessageDetails() {
  const navigate = useNavigate()
  const { messageId } = useParams()

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const message = useSelector(
    (stateSelector) => stateSelector.messageModule.message
  )

  const messageFilter = useSelector(
    (stateSelector) => stateSelector.messageModule.filter
  )
  const [date, setDate] = useState()

  const setMessage = async () => {
    try {
      setIsLoading(true)
      const m = await loadMessage(messageId, messageFilter)
      const d = new Date(m.createdAt)

      setDate(d)
    } catch (err) {
      showErrorMsg(
        prefs.isEnglish ? `Could't load message` : 'לא ניתן לטעון הודעה'
      )
      navigate('/admin')
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    setMessage()
  }, [messageId])

  return (
    <div className='page-container message-details'>
      <div
        className={`message-details-container ${
          prefs.isDarkMode ? 'dark-mode' : ''
        } ${!message.isDone ? 'pending' : ''}`}
      >
        {message.prevNext && (
          <ItemNavigation
            item={message}
            type={'admin/message'}
            lastPage={'/admin/message'}
            isEdit={false}
          />
        )}
        <div className='sender-details-container'>
          <b>{message.title} </b>
          {/* <div
            className={
              prefs.isDarkMode
                ? 'checkbox-container dark-mode'
                : 'checkbox-container'
            }
          >
            <label htmlFor={`${message._id}Done`}>
              {prefs.isEnglish ? 'Done' : 'בוצע'}
            </label>
            <input
              type='checkbox'
              name=''
              id={`${message._id}Done`}
              // onChange={() => handleDoneChange(message._id)}
              checked={message.isDone}
            />
          </div> */}
          <DoneMessageButton message={message} setChange={setMessage} />
          {date && (
            <span>
              {prefs.isEnglish
                ? date.toLocaleDateString('eng')
                : date.toLocaleDateString('he')}
            </span>
          )}
        </div>
        <Divider
          orientation='horizontal'
          flexItem
          sx={{
            backgroundColor: prefs.isDarkMode ? '#fff' : '',
          }}
        />

        <div className='sender-info-container'>
          <b className='sender-info name'>{message.name}</b>
          <span>-</span>
          <span>{message.phone}</span>
        </div>

        <p>{message.content}</p>
      </div>
    </div>
  )
}
