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
import { classService } from '../services/class/class.service'
import { setIsLoading } from '../store/actions/system.actions'

export function ClassDetails() {
  const { classId } = useParams()
  const clas = useSelector((stateSelector) => stateSelector.classModule.class)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const [trainers, setTrainers] = useState([])

  const head = {
    he: clas.title.he,
    eng: clas.title.eng,
  }

  const setClass = async () => {
    try {
      setIsLoading(true)
      const c = await loadClass(classId)

      const t = await classService.getClassTrainer({ ...c })
      setTrainers(t)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setClass()
  }, [classId])

  return (
    <div className='page-container class-details'>
      <HeadContainer text={head} />
      <div className='class-details-container'>
        {' '}
        <img src={clas.img} alt='' />
        <div
          className={
            prefs.isDarkMode ? 'info-container dark-mode' : 'info-container'
          }
        >
          <p>{prefs.isEnglish ? clas.description.eng : clas.description.he}</p>
          <div className='trainers-container'>
            {trainers.map((trainer) => (
              <Link
                to={`/class/trainer/${trainer.id}`}
                key={`${trainer.id}ClassDetails`}
              >
                {prefs.isEnglish ? trainer.name.eng : trainer.name.he}
              </Link>
            ))}
          </div>
          <div className='intensity-container'>
            <b>{prefs.isEnglish ? 'Intensity' : 'עצימות'}</b>
            <IntensityRange intensity={clas.intensity} isReadOnly={true} />
          </div>
        </div>
      </div>
      <ContactUs />
    </div>
  )
}
