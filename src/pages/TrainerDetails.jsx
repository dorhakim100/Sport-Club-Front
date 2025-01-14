import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import {
  capitalizeFirstLetter,
  makeId,
  smoothScroll,
} from '../services/util.service'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadTrainer } from '../store/actions/trainer.actions'

import { HeadContainer } from '../cmps/HeadContainer'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { setIsLoading } from '../store/actions/system.actions'
import { ContactUs } from '../cmps/ContactUs'
import { ItemNavigation } from '../cmps/ItemNavigation'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import IconButton from '@mui/material/IconButton'

export function TrainerDetails() {
  const { trainerId } = useParams()

  const trainer = useSelector(
    (stateSelector) => stateSelector.trainerModule.trainer
  )

  const trainerFilter = useSelector(
    (stateSelector) => stateSelector.trainerModule.filter
  )

  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  const navigate = useNavigate()

  const [head, setHead] = useState({ he: '', eng: '' })

  const getLatestPage = () => {
    let types = ''
    let typesStr = ''
    if (trainerFilter.types.length > 0) {
      typesStr = trainerFilter.types.map((type, index) => {
        const toReturn =
          index === 0 ? (types = type) : (types = types + `%2C${type}`)
        setLastPage(toReturn)
        return toReturn
      })
    }
    const str = `/class/trainer?pageIdx=${trainerFilter.pageIdx}&types=${typesStr}`

    setLastPage(str)
    return str
  }
  useEffect(() => {
    const setTrainer = async () => {
      setIsLoading(true)
      try {
        const t = await loadTrainer(trainerId, trainerFilter)

        setHead({
          he: t.name.he,
          eng: t.name.eng,
        })
        getLatestPage()
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

  const [lastPage, setLastPage] = useState('')

  return (
    <div className='trainer-details'>
      {trainer.prevNext && (
        <ItemNavigation
          item={trainer}
          type={'class/trainer'}
          lastPage={lastPage}
          isEdit={true}
        />
      )}
      <HeadContainer text={head} />
      <div className='trainer-details-container'>
        <div className='img-container'>
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
                    smoothScroll()
                  }}
                >
                  {prefs.isEnglish
                    ? capitalizeFirstLetter(type)
                    : (type === 'gym' && 'חדר כושר') ||
                      (type === 'studio' && 'סטודיו') ||
                      (type === 'swimming' && 'שחייה') ||
                      (type === 'tennis' && 'טניס') ||
                      (type === 'yoga' && 'יוגה')}
                </Link>
              )
            })}
          </div>
        </div>

        <div className='preview-container'>
          <p>{prefs.isEnglish ? trainer.preview.eng : trainer.preview.he}</p>
        </div>
      </div>
      <ContactUs />
    </div>
  )
}
