import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom'
import { makeId, smoothScroll } from '../services/util.service'

import { Preloader } from './Preloader'

import { ButtonGroup } from '@mui/material'
import { Button } from '@mui/material'

export function ClassPreview({ clas, onRemoveClass }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const [isHover, setIsHover] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      className='class-preview-container'
      key={clas._id}
      onClick={(event) => {
        if (isHover) return

        smoothScroll()
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
                smoothScroll()
                navigate(`/class/edit/${clas._id}`)
              }}
              className='edit-btn'
            >
              {prefs.isEnglish ? 'Edit' : 'עריכה'}
            </Button>
            <Button
              onClick={() => onRemoveClass(clas._id)}
              className='remove-btn'
            >
              {prefs.isEnglish ? 'Remove' : 'הסרה'}
            </Button>
          </ButtonGroup>
        )}
        <p style={{ color: 'white' }}>
          {prefs.isEnglish ? clas.preview.eng : clas.preview.he}
        </p>
      </div>
      <div className={prefs.isEnglish ? 'img-container ltr' : 'img-container'}>
        <img src={clas.img} alt='' onLoad={() => setIsLoaded(true)} />
        {!isLoaded && <Preloader img={clas.img} />}
      </div>
    </div>
  )
}
