import React, { useState, useEffect } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { trainerService } from '../services/trainer/trainer.service'

import {
  loadTrainers,
  addTrainer,
  updateTrainer,
  removeTrainer,
} from '../store/actions/trainer.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { userService } from '../services/user/user.service'

import { HeadContainer } from '../cmps/HeadContainer'
import { TrainerFilter } from '../cmps/TrainerFilter.jsx'
import { TrainerList } from '../cmps/TrainerList.jsx'

import Divider from '@mui/material/Divider'

export function TrainerIndex() {
  const trainers = useSelector(
    (stateSelector) => stateSelector.trainerModule.trainers
  )
  const [filter, setFilter] = useState({ types: [], pageIdx: 0, isAll: false })

  const location = useLocation()
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'המדריכים שלנו', eng: 'Our Instructors' }

  useEffect(() => {
    const getTrainers = async () => {
      await loadTrainers(filter)
    }
    getTrainers()
  }, [filter])

  return (
    <section className='trainer-index-container'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <nav className='page-navigation-container'>
        <NavLink to='/class'>{prefs.isEnglish ? 'Class' : 'שיעורים'}</NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='/class/schedule'>
          {prefs.isEnglish ? 'Schedule' : 'לוח החוגים'}
        </NavLink>
        <Divider orientation='vertical' flexItem />
        <NavLink to='/class/trainer'>
          {prefs.isEnglish ? 'Our Instructors' : 'המדריכים שלנו'}
        </NavLink>
      </nav>
      <HeadContainer text={headText} />

      <TrainerFilter filter={filter} setFilter={setFilter} />
      <TrainerList trainers={trainers} />
    </section>
  )
}
