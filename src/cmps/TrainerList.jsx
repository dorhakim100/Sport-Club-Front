import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { smoothScroll } from '../services/util.service'

import { Preloader } from './Preloader'

import { Button } from '@mui/material'
import ButtonGroup from '@mui/material/ButtonGroup'
import { showSuccessMsg } from '../services/event-bus.service'

export function TrainerList({ trainers, onRemoveTrainer, filter, setFilter }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const user = useSelector((storeState) => storeState.userModule.user)
  const isLoading = useSelector(
    (stateSelector) => stateSelector.systemModule.isLoading
  )
  const navigate = useNavigate()

  // const [isLoaded, setIsLoaded] = useState(false)
  // const imgRef = useRef(null)

  // useEffect(() => {
  //   if (imgRef.current && imgRef.current.complete) {
  //     setIsLoaded(true)
  //   }
  // }, [])

  const waitForLoading = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!isLoading) {
          clearInterval(interval) // Stop checking
          resolve() // Resolve the promise
        }
      }, 50) // Check every 50ms
    })
  }

  return (
    <div className='trainers-list-container'>
      {trainers.map((trainer) => {
        return (
          <div
            key={trainer._id}
            className={`trainer-container ${
              user && user.isAdmin && 'clickable'
            }`}
            onClick={(event) => {
              // Define a function that resolves when isLoading becomes false

              const handleAction = async () => {
                if (isLoading) {
                  await waitForLoading() // Wait until isLoading becomes false
                }

                if (
                  event.target.closest('.remove-btn') ||
                  event.target.closest('.edit-btn')
                ) {
                  event.stopPropagation()
                  return
                }

                if (user && user.isAdmin) {
                  smoothScroll()
                  navigate(`/class/trainer/${trainer._id}`)
                }
              }

              handleAction() // Trigger the async function
            }}
          >
            <span>{prefs.isEnglish ? trainer.name.eng : trainer.name.he}</span>
            <div className='img-container'>
              {/* <Preloader img={trainer.img} /> */}
              {/* {!isLoaded && <Preloader img={trainer.img} />} */}
              <img src={trainer.img} alt='' />
            </div>
            <div className='buttons-container' style={{ direction: 'ltr' }}>
              {(user && user.isAdmin && (
                <ButtonGroup
                  variant='contained'
                  aria-label='Basic button group'
                >
                  <Button
                    onClick={async () => {
                      if (isLoading) {
                        await waitForLoading() // Wait until isLoading becomes false
                      }
                      smoothScroll()
                      navigate(`/class/trainer/edit/${trainer._id}`)
                    }}
                    className='edit-btn'
                  >
                    {prefs.isEnglish ? 'Edit' : 'עריכה'}
                  </Button>
                  <Button
                    className='remove-btn'
                    onClick={() => onRemoveTrainer(trainer._id)}
                  >
                    {prefs.isEnglish ? 'Remove' : 'הסרה'}
                  </Button>
                </ButtonGroup>
              )) || (
                <Button
                  variant='contained'
                  className='hidden-btn'
                  onClick={async () => {
                    if (isLoading) {
                      await waitForLoading() // Wait until isLoading becomes false
                    }
                    smoothScroll()

                    navigate(`/class/trainer/${trainer._id}`)
                  }}
                >
                  {prefs.isEnglish ? 'About' : 'מידע נוסף'}
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
