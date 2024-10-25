import React, { useState, useEffect } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { Button } from '@mui/material'
import ButtonGroup from '@mui/material/ButtonGroup'

export function TrainerList({ trainers }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const user = useSelector((storeState) => storeState.userModule.user)
  const navigate = useNavigate()
  console.log(trainers)

  return (
    <div className='trainers-list-container'>
      {trainers.map((trainer) => {
        return (
          <div className='trainer-container'>
            <span>{prefs.isEnglish ? trainer.name.eng : trainer.name.he}</span>
            <div className='img-container'>
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
                      navigate(`/trainer/edit/${trainer._id}`)
                    }}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => onRemoveItem(trainer._id)}>
                    Remove
                  </Button>
                </ButtonGroup>
              )) || (
                <Button
                  variant='contained'
                  className='hidden'
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
