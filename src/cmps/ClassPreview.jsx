import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom'
import { makeId } from '../services/util.service'

import { ButtonGroup } from '@mui/material'
import { Button } from '@mui/material'

export function ClassPreview({ clas, onRemoveClass }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const [isHover, setIsHover] = useState(false)
  return (
    <div
      className='class-preview-container'
      key={clas._id}
      onClick={() => {
        if (isHover) return
        window.scrollTo({ top: 0, behavior: 'smooth' })
        navigate(`/class/${clas._id}`)
      }}
    >
      <div className='title-container'>
        <b>{prefs.isEnglish ? clas.title.eng : clas.title.he}</b>
        {user && user.isAdmin && (
          <ButtonGroup
            variant='contained'
            aria-label='Basic button group'
            style={{ direction: 'ltr' }}
            className='class-button-group'
            onMouseEnter={() => {
              setIsHover(true)
            }}
            onMouseLeave={() => {
              setIsHover(false)
            }}
          >
            <Button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                navigate(`/class/edit/${clas._id}`)
              }}
            >
              {prefs.isEnglish ? 'Edit' : 'עריכה'}
            </Button>
            <Button onClick={() => onRemoveClass(clas._id)}>
              {prefs.isEnglish ? 'Remove' : 'הסרה'}
            </Button>
          </ButtonGroup>
        )}
        <p>
          {/* {prefs.isEnglish ? 'Trainers:' : 'מדריכים:'} */}
          {clas.trainers.map((trainer, index) => {
            return (
              <span key={`${makeId()}ClassPreview`}>
                {prefs.isEnglish
                  ? trainer.name.eng.split(' ')[0]
                  : trainer.name.he.split(' ')[0]}
                {index + 1 !== clas.trainers.length && ','}
              </span>
            )
          })}
        </p>
      </div>
      <div className={prefs.isEnglish ? 'img-container ltr' : 'img-container'}>
        <img src={clas.img} alt='' />
      </div>
    </div>
  )
}
