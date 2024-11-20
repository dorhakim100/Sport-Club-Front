import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Preloader } from './Preloader'

import { Button } from '@mui/material'
import ButtonGroup from '@mui/material/ButtonGroup'

export function TrainerList({ trainers, onRemoveTrainer, filter, setFilter }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const user = useSelector((storeState) => storeState.userModule.user)
  const navigate = useNavigate()

  // const [isLoaded, setIsLoaded] = useState(false)
  // const imgRef = useRef(null)

  // useEffect(() => {
  //   if (imgRef.current && imgRef.current.complete) {
  //     setIsLoaded(true)
  //   }
  // }, [])

  return (
    <div className='trainers-list-container'>
      {trainers.map((trainer) => {
        return (
          <div className='trainer-container'>
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
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                      navigate(`/class/trainer/edit/${trainer._id}`)
                    }}
                  >
                    {prefs.isEnglish ? 'Edit' : 'עריכה'}
                  </Button>
                  <Button onClick={() => onRemoveTrainer(trainer._id)}>
                    {prefs.isEnglish ? 'Remove' : 'הסרה'}
                  </Button>
                </ButtonGroup>
              )) || (
                <Button
                  variant='contained'
                  className='hidden-btn'
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })

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
