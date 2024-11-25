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
import { Controller } from '../cmps/Controller.jsx'
import { HeadContainer } from '../cmps/HeadContainer'

import Divider from '@mui/material/Divider'

export function ClassIndex() {
  const location = useLocation()
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const navigate = useNavigate()

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

  const head = {
    he: 'רשימת השיעורים',
    eng: 'Class List',
  }

  const classes = useSelector(
    (stateSelector) => stateSelector.classModule.classes
  )

  const [searchParams, setSearchParams] = useSearchParams()

  const [filter, setFilter] = useState({
    pageIdx: +searchParams.get('pageIdx'),
    isAll: false,
  })

  const [maxPage, setMaxPage] = useState()

  useEffect(() => {
    const pageIdx = +searchParams.get('pageIdx') || 0

    const filterToSet = { ...filter, pageIdx }

    // Only update filter if it's different
    if (JSON.stringify(filter) !== JSON.stringify(filterToSet)) {
      setFilter(filterToSet)
    }
  }, [searchParams]) // Runs when searchParams change

  // Effect to load classes based on filter
  const getClass = async () => {
    try {
      setIsLoading(true)
      const c = await loadClasses(filter) // Load classes with the current filter

      const max = await classService.getMaxPage()
      setMaxPage(max)

      // Update searchParams if necessary
      console.log(filter)
      const currentPageIdx = searchParams.get('pageIdx') || 0

      if (currentPageIdx !== filter.pageIdx.toString()) {
        setSearchParams({
          pageIdx: filter.pageIdx.toString(),
        })
      }
      return c
    } catch (err) {
      console.log(err)
      showErrorMsg(
        prefs.isEnglish ? `Couldn't load classes` : 'טעינת שיעורים נכשלה'
      )
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    getClass()
  }, [filter]) // Only run when filter changes

  async function onRemoveClass(classId) {
    try {
      await removeClass(classId)
      showSuccessMsg(prefs.isEnglish ? 'Class removed' : 'שיעור הוסר')
      const newClass = await getClass()
      if (newClass.length === 0) {
        const pageToSet = filter.pageIdx - 1
        setFilter({ ...filter, pageIdx: pageToSet })
      }
    } catch (err) {
      showErrorMsg(prefs.isEnglish ? `Couldn't remove class` : 'שיעור לא הוסר')
    }
  }

  async function onAddClass() {
    const clas = classService.getEmptyClass()

    delete clas._id
    try {
      const savedClass = await addClass(clas)
      showSuccessMsg(prefs.isEnglish ? `Class added` : 'שיעור נוסף')
      navigate(`/class/edit/${savedClass._id}`)
    } catch (err) {
      console.log(err)
      showErrorMsg(prefs.isEnglish ? `Cannot add class` : 'פעולה לא בוצעה')
    }
  }

  return (
    <section className='class-page-container'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <Nav origin={origin} links={links} />
      <HeadContainer text={head} />
      <Controller
        filter={filter}
        setFilter={setFilter}
        maxPage={maxPage}
        onAdd={onAddClass}
      />
      <ClassList classes={classes} onRemoveClass={onRemoveClass} />
    </section>
  )
}
