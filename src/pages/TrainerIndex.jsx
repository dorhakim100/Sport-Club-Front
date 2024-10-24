import React, { useState, useEffect } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from 'react-router-dom'
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

import { Nav } from '../cmps/Nav'
import { HeadContainer } from '../cmps/HeadContainer'
import { TrainerFilter } from '../cmps/TrainerFilter.jsx'
import { TrainerList } from '../cmps/TrainerList.jsx'

import Divider from '@mui/material/Divider'

export function TrainerIndex() {
  const trainers = useSelector(
    (stateSelector) => stateSelector.trainerModule.trainers
  )
  const [filter, setFilter] = useState({ types: [], pageIdx: 0, isAll: false })
  const [searchParams, setSearchParams] = useSearchParams()

  const location = useLocation()
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const headText = { he: 'המדריכים שלנו', eng: 'Our Instructors' }

  const origin = {
    path: '/class',
    he: 'שיעורים',
    eng: 'Class',
  }

  const links = [
    {
      path: '/class/schedule',
      he: 'לוח החוגים',
      eng: 'Schedule',
    },
    {
      path: '/class/trainer',
      he: 'המדריכים שלנו',
      eng: 'Our Instructors',
    },
  ]

  useEffect(() => {
    const getTrainers = async () => {
      await loadTrainers(filter)
      setSearchParams(filter)
    }
    getTrainers()
  }, [filter, searchParams])

  return (
    <section className='trainer-index-container'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <Nav origin={origin} links={links} />
      <HeadContainer text={headText} />

      <TrainerFilter filter={filter} setFilter={setFilter} />
      <TrainerList trainers={trainers} />
    </section>
  )
}
