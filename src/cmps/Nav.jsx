import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Divider from '@mui/material/Divider'

export function Nav({ origin, links }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const openMessages = useSelector(
    (stateSelector) => stateSelector.messageModule.openLength
  )

  return (
    <nav className='page-navigation-container'>
      <NavLink to={`${origin.path}`}>
        {prefs.isEnglish ? origin.eng : origin.he}
      </NavLink>
      <Divider orientation='vertical' flexItem />

      {links.map((link, index) => {
        return (
          ((link.path === 'message' || link.path === 'order') && (
            <>
              <NavLink to={link.path} className={'notification-btn'}>
                {prefs.isEnglish ? link.eng : link.he}

                {link.path === 'message' && openMessages > 0 && (
                  <span>{openMessages}</span>
                )}
                {link.path === 'order' && 0 > 0 && <span>0</span>}
              </NavLink>
              {index + 1 < links.length && (
                <Divider orientation='vertical' flexItem />
              )}
            </>
          )) || (
            <>
              <NavLink to={link.path}>
                {prefs.isEnglish ? link.eng : link.he}
              </NavLink>
              {index + 1 < links.length && (
                <Divider orientation='vertical' flexItem />
              )}
            </>
          )
        )
      })}
      {/* <NavLink to='organization'>
        {prefs.isEnglish ? 'Organization' : 'עמותה'}
      </NavLink>
      <Divider orientation='vertical' flexItem />
      <NavLink to='accessibility'>
        {prefs.isEnglish ? 'Accessibility' : 'נגישות'}
      </NavLink> */}
    </nav>
  )
}
