import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { smoothScroll } from '../services/util.service'

import { loadClass } from '../store/actions/class.actions'

import { HeadContainer } from '../cmps/HeadContainer'
import { ItemNavigation } from '../cmps/ItemNavigation'

import { IntensityRange } from '../cmps/IntensityRange'
import { ContactUs } from '../cmps/ContactUs'
import { classService } from '../services/class/class.service'
import { setIsLoading } from '../store/actions/system.actions'

export function ClassDetails() {
  const { classId } = useParams()
  const clas = useSelector((stateSelector) => stateSelector.classModule.class)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const user = useSelector((stateSelector) => stateSelector.userModule.user)

  const [trainers, setTrainers] = useState([])

  const classFilter = useSelector(
    (stateSelector) => stateSelector.classModule.filter
  )

  const head = {
    he: clas.title.he,
    eng: clas.title.eng,
  }
  const [lastPage, setLastPage] = useState('')
  const getLatestPage = () => {
    const str = `/class?pageIdx=${classFilter.pageIdx}`

    setLastPage(str)
    return str
  }

  const setClass = async () => {
    try {
      setIsLoading(true)
      const c = await loadClass(classId, classFilter)

      const t = await classService.getClassTrainer({ ...c })
      getLatestPage()

      setTrainers(t)
    } catch (err) {
      // // console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setClass()
  }, [classId])

  return (
    <div className='class-details'>
      {clas.prevNext && (
        <ItemNavigation
          item={clas}
          type={'class'}
          lastPage={lastPage}
          isEdit={true}
        />
      )}
      <HeadContainer text={head} />
      <div className='class-details-container'>
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
                onClick={() => smoothScroll()}
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
