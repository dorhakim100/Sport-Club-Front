import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Divider from '@mui/material/Divider'

export function Nav({ origin, links }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <nav className='page-navigation-container'>
      <NavLink to={`${origin.path}`}>
        {prefs.isEnglish ? origin.eng : origin.he}
      </NavLink>
      <Divider orientation='vertical' flexItem />

      {links.map((link, index) => {
        return (
          <>
            <NavLink to={link.path}>
              {prefs.isEnglish ? link.eng : link.he}
            </NavLink>
            {index + 1 < links.length && (
              <Divider orientation='vertical' flexItem />
            )}
          </>
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
