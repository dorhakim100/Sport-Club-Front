import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { itemService } from '../services/item/item.service'
import { userService } from '../services/user/user.service'

import { HeadContainer } from '../cmps/HeadContainer'

export function Cart() {
  const user = useSelector((stateSelector) => stateSelector.userModule.user)
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  const headText = { eng: user.fullname, he: user.fullname }

  return (
    <section className='page-container cart-container'>
      <h2>{prefs.isEnglish ? 'Shopping Cart' : 'סל הקניות'}</h2>
      <HeadContainer text={headText} />
    </section>
  )
}
