import { useSelector } from 'react-redux'
import { useEffect } from 'react'

import { AccordionCmp } from '../cmps/AccordionCmp.jsx'
import { FacilitiesTxt } from '../cmps/FacilitiesTxt.jsx'
import { ContactUs } from '../cmps/ContactUs.jsx'

import facilities from '/public/jsons/Facilities/Facilities.json'

export function Facilities() {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)

  return (
    <section className='facilities-container'>
      <h2> {prefs.isEnglish ? 'Facilities' : 'מתקני המועדון'}</h2>
      <div className='imgs-container'></div>
      <FacilitiesTxt facilities={facilities} />
      <ContactUs />
    </section>
  )
}
