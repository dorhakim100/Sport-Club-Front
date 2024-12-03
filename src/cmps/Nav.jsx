import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Divider from '@mui/material/Divider'
import { makeId } from '../services/util.service'

export function Nav({ origin, links, isMain }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const openMessages = useSelector(
    (stateSelector) => stateSelector.messageModule.openLength
  )
  const navigate = useNavigate()

  return (
    <nav
      className={
        isMain ? 'page-navigation-container main' : 'page-navigation-container'
      }
    >
      <>
        <NavLink to={`${origin.path}`}>
          {prefs.isEnglish ? origin.eng : origin.he}
        </NavLink>
        {!isMain && (
          <Divider
            style={prefs.isDarkMode ? { backgroundColor: '#787878' } : {}}
            orientation='vertical'
            flexItem
          />
        )}
      </>

      {links.map((link, index) => {
        return (
          ((link.path === 'message' || link.path === 'order') && (
            <div key={makeId()}>
              <NavLink
                to={link.path}
                className={'notification-btn'}
                key={makeId()}
              >
                {prefs.isEnglish ? link.eng : link.he}

                {link.path === 'message' && openMessages > 0 && (
                  <span>{openMessages}</span>
                )}
                {link.path === 'order' && 0 > 0 && <span>0</span>}
              </NavLink>
              {index + 1 < links.length && (
                <Divider
                  style={prefs.isDarkMode ? { backgroundColor: '#787878' } : {}}
                  orientation='vertical'
                  flexItem
                />
              )}
            </div>
          )) ||
          (isMain && (
            <div
              key={makeId()}
              onClick={() => navigate(link.path)}
              className='nav-logo-container'
            >
              <div className={'main-link-container'}>
                <NavLink to={link.path} key={makeId()}>
                  {prefs.isEnglish ? link.eng : link.he}
                </NavLink>
                <img
                  src={prefs.isDarkMode ? link.darkIcon : link.icon}
                  alt={`${link.eng} Icon`}
                  className='icon-class'
                />
              </div>
              {/* {index + 1 < links.length && (
                <Divider orientation='vertical' flexItem />
              )} */}
            </div>
          )) || (
            <div key={makeId()}>
              <NavLink to={link.path} className={'link'}>
                {prefs.isEnglish ? link.eng : link.he}
              </NavLink>

              {index + 1 < links.length && (
                <Divider
                  style={prefs.isDarkMode ? { backgroundColor: '#787878' } : {}}
                  orientation='vertical'
                  flexItem
                />
              )}
            </div>
          )
        )
      })}
    </nav>
  )
}
