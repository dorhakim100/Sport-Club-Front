import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'

import { ClassPreview } from './ClassPreview.jsx'

export function ClassList({ classes }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <div className='class-list-container'>
      {classes.map((clas) => {
        return <ClassPreview clas={clas} />
      })}
    </div>
  )
}
