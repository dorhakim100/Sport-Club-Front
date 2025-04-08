import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { classService } from '../services/class/class.service'

import {
  addClass,
  loadClasses,
  removeClass,
} from '../store/actions/class.actions'
import { setIsLoading } from '../store/actions/system.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { debounce } from '../services/util.service'

import { Nav } from '../cmps/Nav'
import { ClassList } from '../cmps/ClassList.jsx'
import { Controller } from '../cmps/Controller.jsx'
import { HeadContainer } from '../cmps/HeadContainer'

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
    intensity: searchParams.get('intensity') || '',
    isAll: false,
    txt: searchParams.get('txt') || '',
  })

  const debouncedSetFilter = useRef(debounce(setFilter, 500))

  const [editFilter, setEditFilter] = useState(classService.getDefaultFilter())

  const [maxPage, setMaxPage] = useState()

  useEffect(() => {
    const pageIdx = +searchParams.get('pageIdx') || 0

    const txt = searchParams.get('txt')
    const intensity = +searchParams.get('intensity') || ''

    const filterToSet = { ...filter, pageIdx, txt, intensity }
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

      const max = await classService.getMaxPage(filter)
      setMaxPage(max)

      // Update searchParams if necessary

      const currentPageIdx = searchParams.get('pageIdx') || 0
      const currentTxt = searchParams.get('txt') || ''
      const currentIntensity = searchParams.get('intensity') || ''

      const paramsFilter = {
        pageIdx: currentPageIdx,
        txt: currentTxt,
        intensity: currentIntensity,
      }

      if (JSON.stringify(filter) !== JSON.stringify(paramsFilter)) {
        setSearchParams({
          txt: filter.txt || '',
          intensity: filter.intensity || '',
          pageIdx: filter.pageIdx.toString(),
        })
      }
      return c
    } catch (err) {
      // // console.log(err)
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
      // // console.log(err)
      showErrorMsg(prefs.isEnglish ? `Cannot add class` : 'פעולה לא בוצעה')
    }
  }

  function handleChange({ target }) {
    const field = target.name
    const value = target.value
    const type = target.type || target.name

    switch (type) {
      case 'search':
        setEditFilter({ ...editFilter, txt: value })
        debouncedSetFilter.current((prevFilter) => ({
          ...prevFilter,
          txt: value,
          pageIdx: 0,
        }))
        break

      case 'intensity':
        setEditFilter({ ...editFilter, intensity: value })
        debouncedSetFilter.current((prevFilter) => ({
          ...prevFilter,
          intensity: value,
          pageIdx: 0,
        }))
        break

      default:
        break
    }
  }

  return (
    <section className='class-page-container'>
      <h2>{prefs.isEnglish ? 'Class' : 'שיעורים'}</h2>
      <Nav origin={origin} links={links} />
      <HeadContainer text={head} />
      <div className='filter-container'>
        <Controller
          filter={filter}
          setFilter={setFilter}
          maxPage={maxPage}
          onAdd={onAddClass}
        />
        <div
          className={
            prefs.isDarkMode ? 'input-container dark-mode' : 'input-container'
          }
        >
          <input
            type='search'
            value={editFilter.txt}
            onChange={(event) => {
              handleChange(event)
            }}
            placeholder={prefs.isEnglish ? 'Class name' : 'שם השיעור'}
          />
        </div>
        <div className='intensity-container'>
          <span>
            {prefs.isEnglish ? 'Max Intensity level' : 'דרגת קושי מקסימלית'}
          </span>
          <IntensitySlider handleChange={handleChange} />
        </div>
      </div>
      <ClassList classes={classes} onRemoveClass={onRemoveClass} />
    </section>
  )
}

import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

function valuetext(value) {
  return `${value}`
}

function IntensitySlider({ handleChange }) {
  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label='Temperature'
        onChange={handleChange}
        defaultValue={5}
        getAriaValueText={valuetext}
        valueLabelDisplay='auto'
        shiftStep={1}
        step={1}
        marks
        min={1}
        max={5}
        name='intensity'
      />
    </Box>
  )
}
