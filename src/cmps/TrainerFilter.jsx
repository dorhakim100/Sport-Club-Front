import React, { useState, useEffect } from 'react'
import { NavLink, Link, Outlet } from 'react-router-dom'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export function TrainerFilter({ filter, setFilter }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  return (
    <div className='trainer-filter-container'>
      <div className='checkbox-container'>
        <label htmlFor=''>{prefs.isenglish ? 'Gym' : 'חדר כושר'}</label>
        <input type='checkbox' name='' id='' />
      </div>
      <div className='checkbox-container'>
        <label htmlFor=''>{prefs.isenglish ? 'Studio' : 'סטודיו'}</label>
        <input type='checkbox' name='' id='' />
      </div>
      <div className='checkbox-container'>
        <label htmlFor=''>{prefs.isenglish ? 'Yoga' : 'יוגה'}</label>
        <input type='checkbox' name='' id='' />
      </div>
    </div>
  )
}
