import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { HeadContainer } from '../cmps/HeadContainer'
import { VisibleCards } from '../cmps/VisibleCards.jsx'
import { MemberTypes } from '../cmps/MemberTypes.jsx'
import { MemberText } from '../cmps/MemberText.jsx'

import { showErrorMsg } from '../services/event-bus.service'
import { setIsLoading } from '../store/actions/system.actions'

import { Button } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export function MemberIndex() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const head = {
    he: 'מנויים',
    eng: 'Members',
  }

  const text = {
    he: `אנו מציעים 3 סוגי מנוי, בהתאם לצרכים של כל אחד ואחת`,
    eng: `We offer three kinds of memberships, depending on each and everyone's needs.`,
  }

  return (
    <div className='member-index-container'>
      <h2>{prefs.isEnglish ? head.eng : head.he}</h2>
      {/* <HeadContainer text={head} /> */}
      {/* <VisibleCards /> */}
      {/* <b className='member-text'>{prefs.isEnglish ? text.eng : text.he}</b> */}

      <MemberText />
    </div>
  )
}
