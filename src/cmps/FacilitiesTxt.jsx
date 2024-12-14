import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { makeId } from '../services/util.service'

import { HeadContainer } from './HeadContainer'

export function FacilitiesTxt({ facilities }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(prefs.isEnglish ? 'show' : 'show-rtl')
          // entry.target.classList.remove('hidden')
        } else {
          entry.target.classList.remove(prefs.isEnglish ? 'show' : 'show-rtl')
        }
      })
    })

    const elements = document.querySelectorAll('.section')
    elements.forEach((el) => observer.observe(el))

    return () => elements.forEach((el) => observer.unobserve(el))
  }, [prefs.isEnglish, prefs.isDarkMode])
  return (
    <div className='facilities-text-container'>
      {facilities.map((facility) => {
        return (
          <div className='facility-container section hidden' key={makeId()}>
            <HeadContainer
              text={{ eng: facility.title.eng, he: facility.title.he }}
            />
            <div className='facility-content-container'>
              <div className='facility-txt-container'>
                <p>
                  {prefs.isEnglish
                    ? facility.description.eng
                    : facility.description.he}
                </p>
              </div>
            </div>
            <img src={facility.img} alt='' />
          </div>
        )
      })}
    </div>
  )
}
