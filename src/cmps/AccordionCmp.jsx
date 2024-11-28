import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'

import { useEffect } from 'react'
import { HeadContainer } from './HeadContainer'

import { useSelector } from 'react-redux'
import { makeId } from '../services/util.service'

// $bold-navy: #2C3E50;
// $very-light-blue: #dff9ff;
// $very-dark-blue: #263039;
// $darkest-blue:#181e24;

export function AccordionCmp({ facilities }) {
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
  }, [prefs.isEnglish])
  return (
    <div className='accordions-container'>
      {facilities.map((facility) => {
        return (
          <div className='accordion-container section hidden' key={makeId()}>
            <HeadContainer
              text={{ eng: facility.title.eng, he: facility.title.he }}
            />
            <Accordion
              sx={{
                backgroundColor: 'transparent',
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    sx={{
                      color: prefs.isDarkMode ? 'white' : '#263039',
                    }}
                  />
                }
                aria-controls='panel1-content'
                id='panel1-header'
                sx={
                  prefs.isDarkMode
                    ? {
                        backgroundColor: '#263039',
                        color: 'white',
                        borderTopRightRadius: '5px',
                        borderTopLeftRadius: '5px',
                      }
                    : {
                        borderTopRightRadius: '5px',
                        borderTopLeftRadius: '5px',
                      }
                }
              >
                Accordion 1
              </AccordionSummary>
              <AccordionDetails
                sx={
                  prefs.isDarkMode
                    ? {
                        backgroundColor: '#263039',
                        backgroundColor: '#181e24',
                        color: 'white',

                        borderBottomRightRadius: '5px',
                        borderBottomLeftRadius: '5px',
                      }
                    : {
                        borderBottomRightRadius: '5px',
                        borderBottomLeftRadius: '5px',
                      }
                }
              >
                {prefs.isEnglish
                  ? facility.description.eng
                  : facility.description.he}
              </AccordionDetails>
            </Accordion>
            <img src={facility.img} alt='' />
          </div>
        )
      })}
    </div>
  )
}
