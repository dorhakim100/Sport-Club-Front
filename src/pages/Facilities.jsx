import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { FacilitiesTxt } from '../cmps/FacilitiesTxt.jsx'
import { ContactUs } from '../cmps/ContactUs.jsx'
import { textAnimation } from '../services/util.service.js'

import facilitiesJson from '/public/jsons/Facilities/Facilities.json'

export function Facilities() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const facilities = facilitiesJson

  // useEffect(() => {
  //   textAnimation(prefs)
  // }, [prefs.isEnglish, prefs.isDarkMode])
  return (
    <section className='facilities-container'>
      <h2> {prefs.isEnglish ? 'Facilities' : 'מתקני המועדון'}</h2>
      <div className='imgs-container'></div>
      <FacilitiesTxt facilities={facilities} />
      <ContactUs />
    </section>
  )
}
