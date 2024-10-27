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
import { Button } from '@mui/material'

export function TrainerIndex() {
  const trainers = useSelector(
    (stateSelector) => stateSelector.trainerModule.trainers
  )
  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  const [searchParams, setSearchParams] = useSearchParams()

  const navigate = useNavigate()

  const [filter, setFilter] = useState({
    types: searchParams.get('types')
      ? searchParams.get('types').split(',')
      : [],
    pageIdx: +searchParams.get('pageIdx'),
    isAll: false,
  })

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
    const pageIdx = +searchParams.get('pageIdx') || 0
    const typesParam = searchParams.get('types') || ''

    const types = typesParam ? typesParam.split(',') : []

    const filterToSet = { ...filter, types, pageIdx }

    // Only update filter if it's different
    if (JSON.stringify(filter) !== JSON.stringify(filterToSet)) {
      setFilter(filterToSet)
    }
  }, [searchParams]) // Runs when searchParams change

  // Effect to load trainers based on filter
  const getTrainers = async () => {
    await loadTrainers(filter) // Load trainers with the current filter

    // Update searchParams if necessary
    const currentPageIdx = searchParams.get('pageIdx') || 0
    const currentTypes = searchParams.get('types') || ''

    if (
      currentPageIdx !== filter.pageIdx.toString() ||
      currentTypes !== filter.types.toString()
    ) {
      setSearchParams({
        pageIdx: filter.pageIdx.toString(),
        types: filter.types.toString(),
      })
    }
  }
  useEffect(() => {
    getTrainers()
  }, [filter]) // Only run when filter changes

  async function onRemoveTrainer(trainerId) {
    try {
      await removeTrainer(trainerId)
      showSuccessMsg(prefs.isEnglish ? 'Trainer removed' : 'מאמן הוסר')
      getTrainers()
    } catch (err) {
      showErrorMsg(prefs.isEnglish ? `Couldn't remove trainer` : 'מאמן לא הוסר')
    }
  }

  async function onAddTrainer() {
    const trainer = trainerService.getEmptyTrainer()

    delete trainer._id
    try {
      const savedTrainer = await addTrainer(trainer)
      showSuccessMsg(prefs.isEnglish ? `Trainer added` : 'מאמן נוסף')
      navigate(`/class/trainer/edit/${savedTrainer._id}`)
    } catch (err) {
      console.log(err)
      showErrorMsg(prefs.isEnglish ? `Cannot add trainer` : 'פעולה לא בוצעה')
    }
  }

  return (
    <section className='trainer-index-container'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <Nav origin={origin} links={links} />
      <HeadContainer text={headText} />
      <TrainerFilter filter={filter} setFilter={setFilter} />
      {user && user.isAdmin && (
        <Button variant='contained' onClick={onAddTrainer}>
          {prefs.isEnglish ? 'Add' : 'הוסף'}
        </Button>
      )}{' '}
      <TrainerList trainers={trainers} onRemoveTrainer={onRemoveTrainer} />
    </section>
  )
}
