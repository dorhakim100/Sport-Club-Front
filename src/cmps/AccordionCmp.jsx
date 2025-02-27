import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { useEffect } from 'react'

import { useSelector } from 'react-redux'
import { makeId } from '../services/util.service'

export function AccordionCmp({ options }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <div className='accordions-container'>
      {options.map((option) => {
        return (
          <div className='accordion-container' key={makeId()}>
            {/* <HeadContainer
              text={{ eng: option.title.eng, he: option.title.he }}
            /> */}
            <Accordion
              sx={{
                // width: '1000px',
                width: 'auto',
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
                        textAlign: 'start',
                      }
                    : {
                        borderTopRightRadius: '5px',
                        borderTopLeftRadius: '5px',
                        textAlign: 'start',
                      }
                }
              >
                <b> {prefs.isEnglish ? option.title.eng : option.title.he}</b>
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
                  ? option.description.eng
                  : option.description.he}
              </AccordionDetails>
            </Accordion>
          </div>
        )
      })}
    </div>
  )
}
