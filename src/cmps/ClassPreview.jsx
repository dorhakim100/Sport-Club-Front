import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams, useParams, Link } from 'react-router-dom'
import { makeId } from '../services/util.service'

export function ClassPreview({ clas }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const navigate = useNavigate()
  console.log(clas)
  return (
    <div
      className='class-preview-container'
      key={clas._id}
      onClick={() => {
        navigate(`/class/${clas._id}`)
      }}
    >
      <div className='title-container'>
        <b>{prefs.isEnglish ? clas.title.eng : clas.title.he}</b>
        <p>
          {prefs.isEnglish ? 'Trainers:' : 'מדריכים:'}
          {clas.trainers.map((trainer, index) => {
            return (
              <span key={`${makeId()}ClassPreview`}>
                {prefs.isEnglish ? trainer.name.eng : trainer.name.he}
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
