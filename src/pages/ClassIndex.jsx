import React, { useState, useEffect } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from 'react-router-dom'
import { useSelector } from 'react-redux'

import { classService } from '../services/class/class.service'

import {
  addClass,
  loadClass,
  loadClasses,
  removeClass,
  updateClass,
} from '../store/actions/class.actions'
import { setIsLoading } from '../store/actions/system.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { Nav } from '../cmps/Nav'
import { ClassList } from '../cmps/ClassList.jsx'

import Divider from '@mui/material/Divider'

export function ClassIndex() {
  const location = useLocation()
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  const origin = {
    path: '/class',
    he: 'שיעורים',
    eng: 'Class',
  }

  const links = [
    {
      path: 'schedule',
      he: 'לוח החוגים',
      eng: 'Schedule',
    },
    {
      path: 'trainer',
      he: 'המדריכים שלנו',
      eng: 'Our Instructors',
    },
  ]

  const classes = useSelector(
    (stateSelector) => stateSelector.classModule.classes
  )
  console.log(classes)

  const [searchParams, setSearchParams] = useSearchParams()

  const [filter, setFilter] = useState({
    pageIdx: +searchParams.get('pageIdx'),
    isAll: false,
  })

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

  // Effect to load classes based on filter
  const getClass = async () => {
    try {
      setIsLoading(true)
      await loadClasses(filter) // Load classes with the current filter
    } catch (err) {
      console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't load classes` : 'טעינת שיעורים נכשלה'
      )
    } finally {
      setIsLoading(false)
    }

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
    getClass()
  }, [filter]) // Only run when filter changes

  async function onRemoveTrainer(trainerId) {
    try {
      await removeTrainer(trainerId)
      showSuccessMsg(prefs.isEnglish ? 'Trainer removed' : 'מאמן הוסר')
      getClass()
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
    <section className='class-page-container'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <Nav origin={origin} links={links} />
      <ClassList classes={classes} />
    </section>
  )
}
