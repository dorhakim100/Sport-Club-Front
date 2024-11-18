import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadTrainer } from '../store/actions/trainer.actions'

import { HeadContainer } from '../cmps/HeadContainer'
import { capitalizeFirstLetter, makeId } from '../services/util.service'

import { Button } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { setIsLoading } from '../store/actions/system.actions'
import { ContactUs } from '../cmps/ContactUs'

export function TrainerDetails() {
  const { trainerId } = useParams()

  const trainer = useSelector(
    (stateSelector) => stateSelector.trainerModule.trainer
  )

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const navigate = useNavigate()

  const [head, setHead] = useState({ he: '', eng: '' })

  useEffect(() => {
    const setTrainer = async () => {
      setIsLoading(true)
      try {
        const t = await loadTrainer(trainerId)
        setHead({
          he: t.name.he,
          eng: t.name.eng,
        })
      } catch (err) {
        console.log(err)
        showErrorMsg(
          prefs.isEnglish ? `Couldn't show trainers` : 'טעינת מאמנים נכשלה'
        )
      } finally {
        setIsLoading(false)
      }
    }
    setTrainer()
  }, [trainerId])

  return (
    <div className='trainer-details'>
      {/* <Button
        variant='contained'
        className='back-btn'
        onClick={() => {
          navigate('/class/trainer')
        }}
      >
        <ArrowBackIosNewIcon />
      </Button> */}
      <HeadContainer text={head} />
      <div className='trainer-details-container'>
        <img src={trainer.img} alt='' />
        <div
          className={
            prefs.isDarkMode ? 'types-container dark-mode' : 'types-container'
          }
        >
          {trainer.types.map((type) => {
            return (
              <Link
                to={`/class/trainer?pageIdx=0&types=${type}`}
                key={makeId()}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                {prefs.isEnglish
                  ? capitalizeFirstLetter(type)
                  : (type === 'gym' && 'חדר כושר') ||
                    (type === 'studio' && 'סטודיו') ||
                    (type === 'swimming' && 'שחייה') ||
                    (type === 'Tennis' && 'טניס') ||
                    (type === 'yoga' && 'יוגה')}
              </Link>
            )
          })}
        </div>

        <div className='preview-container'>
          <p>{prefs.isEnglish ? trainer.preview.eng : trainer.preview.he}</p>
        </div>
      </div>
      <ContactUs />
    </div>
  )
}
