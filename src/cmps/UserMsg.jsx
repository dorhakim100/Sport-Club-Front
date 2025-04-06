import { eventBus } from '../services/event-bus.service'
import { useState, useEffect, useRef } from 'react'

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export function UserMsg() {
  const [msg, setMsg] = useState(null)
  const timeoutIdRef = useRef()

  useEffect(() => {
    const unsubscribe = eventBus.on('show-msg', (msg) => {
      setMsg(msg)
      if (timeoutIdRef.current) {
        timeoutIdRef.current = null
        clearTimeout(timeoutIdRef.current)
      }
      timeoutIdRef.current = setTimeout(closeMsg, 3000)
    })
    // socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, review => {
    // 	showSuccessMsg(`New review about me ${review.txt}`)
    // })
    return () => {
      unsubscribe()
      // socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU)
    }
  }, [])

  function closeMsg() {
    setMsg(null)
  }

  function msgClass() {
    return msg ? 'visible' : ''
  }
  return (
    <section className={`user-msg ${msg?.type} ${msgClass()}`}>
      {/* <button onClick={closeMsg}>x</button>
      {msg?.txt} */}
      <Alert
        severity={
          msg?.type === 'success'
            ? 'success'
            : msg?.type === 'error'
            ? 'error'
            : ''
        }
      >
        <AlertTitle>
          {msg?.type === 'success'
            ? 'Success'
            : msg?.type === 'error'
            ? 'Error'
            : ''}
        </AlertTitle>
        {msg?.txt}
      </Alert>
    </section>
  )
}
