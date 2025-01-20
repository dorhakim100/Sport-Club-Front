import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { textAnimation } from '../services/util.service'

import { MemberText } from '../cmps/MemberText.jsx'
import { ContactUs } from '../cmps/ContactUs'

import text from '/public/jsons/Members/MemberIndex.json'

export function MemberIndex() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const head = {
    he: 'מנויים',
    eng: 'Members',
  }

  const splitText = (prefs.isEnglish ? text.eng : text.he).split('\n')

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      console.log(entries)
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
    <div className='member-index-container'>
      <h2>{prefs.isEnglish ? head.eng : head.he}</h2>
      <div className='member-preview-container'>
        {splitText.map((line, index) => (
          // Render each line, and add a <br> tag after each one except the last
          <p key={index}>
            {line}
            {index < splitText.length - 1 && <br />}
          </p>
        ))}
      </div>

      {/* <HeadContainer text={head} /> */}
      {/* <VisibleCards /> */}
      {/* <b className='member-text'>{prefs.isEnglish ? text.eng : text.he}</b> */}

      <MemberText />
      <ContactUs />
    </div>
  )
}
