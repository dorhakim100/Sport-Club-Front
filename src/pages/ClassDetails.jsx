import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { loadClass } from '../store/actions/class.actions'

import { AddToCartButton } from '../cmps/AddToCartButton'
import { Quantity } from '../cmps/Quantity.jsx'
import { HeadContainer } from '../cmps/HeadContainer'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { IntensityRange } from '../cmps/IntensityRange'
import { ContactUs } from '../cmps/ContactUs'

export function ClassDetails() {
  const { classId } = useParams()
  const clas = useSelector((stateSelector) => stateSelector.classModule.class)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const head = {
    he: clas.title.he,
    eng: clas.title.eng,
  }

  useEffect(() => {
    loadClass(classId)
  }, [classId])
  return (
    <div className='page-container class-details'>
      <HeadContainer text={head} />
      <div className='class-details-container'>
        <div
          className={
            prefs.isDarkMode ? 'info-container dark-mode' : 'info-container'
          }
        >
          <p>{prefs.isEnglish ? clas.preview.eng : clas.preview.he}</p>
          <div className='trainers-container'>
            {clas.trainers.map((trainer) => (
              <div
                className='trainer-container'
                key={`${trainer.id}ClassDetails`}
              >
                <Link to={`/class/trainer/${trainer.id}`}>
                  {prefs.isEnglish ? trainer.name.eng : trainer.name.he}
                </Link>
              </div>
            ))}
          </div>
          <div className='intensity-container'>
            <b>{prefs.isEnglish ? 'Intensity' : 'עצימות'}</b>
            <IntensityRange intensity={clas.intensity} isReadOnly={true} />
          </div>
        </div>
        <img src={clas.img} alt='' />
      </div>
      <ContactUs />
    </div>
  )
}
