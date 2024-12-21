import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { makeId } from '../services/util.service'

import { HeadContainer } from '../cmps/HeadContainer'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { ContactUs } from '../cmps/ContactUs'

export function OpeningTimes() {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)
  const text = { he: 'שעות הפתיחה', eng: 'Opening Times' }
  const [days, setDays] = useState(getDefaultTimes())

  function getDefaultTimes() {
    return [
      {
        he: 'ראשון',
        eng: 'Sunday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '13:00',
            },
            {
              from: '15:00',
              to: '21:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '13:00',
            },
            {
              from: '16:00',
              to: '21:00',
            },
          ],
        },
      },
      {
        he: 'שני',
        eng: 'Monday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
        },
      },
      {
        he: 'שלישי',
        eng: 'Tuesday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
        },
      },
      {
        he: 'רביעי',
        eng: 'Wednesday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
        },
      },
      {
        he: 'חמישי',
        eng: 'Thursday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '13:00',
            },
            {
              from: '16:00',
              to: '21:00',
            },
          ],
        },
      },
      {
        he: 'שישי',
        eng: 'Friday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '17:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '16:00',
            },
          ],
        },
      },
      {
        he: 'שבת',
        eng: 'Saturday',
        times: {
          pool: [
            {
              from: '08:00',
              to: '17:00',
            },
          ],
          gym: [
            {
              from: '08:00',
              to: '16:00',
            },
          ],
        },
      },
    ]
  }

  function getJulyAugustTimes() {
    return [
      {
        he: 'ראשון',
        eng: 'Sunday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '12:00',
            },
            {
              from: '15:00',
              to: '21:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '13:00',
            },
            {
              from: '16:00',
              to: '21:00',
            },
          ],
        },
      },
      {
        he: 'שני',
        eng: 'Monday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
        },
      },
      {
        he: 'שלישי',
        eng: 'Tuesday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
        },
      },
      {
        he: 'רביעי',
        eng: 'Wednesday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
        },
      },
      {
        he: 'חמישי',
        eng: 'Thursday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '21:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '13:00',
            },
            {
              from: '16:00',
              to: '21:00',
            },
          ],
        },
      },
      {
        he: 'שישי',
        eng: 'Friday',
        times: {
          pool: [
            {
              from: '06:00',
              to: '18:00',
            },
          ],
          gym: [
            {
              from: '06:00',
              to: '16:00',
            },
          ],
        },
      },
      {
        he: 'שבת',
        eng: 'Saturday',
        times: {
          pool: [
            {
              from: '08:00',
              to: '18:00',
            },
          ],
          gym: [
            {
              from: '08:00',
              to: '16:00',
            },
          ],
        },
      },
    ]
  }

  function isInJulyOrAugust() {
    const now = new Date() // Get current date and time
    const month = now.getMonth() // Month is zero-based (0 = January, 6 = July, 7 = August)
    return month === 6 || month === 7 // Check if the month is July or August
  }
  useEffect(() => {
    const isWithinJulyAugust = isInJulyOrAugust()
    if (isWithinJulyAugust) {
      setDays(getJulyAugustTimes())
    }
  }, [])

  return (
    <div className='times-container'>
      <HeadContainer text={text} />
      <TableContainer component={Paper}>
        <Table
          sx={{
            backgroundColor: prefs.isDarkMode && '#263039',
            // maxWidth: '1000px',
          }}
          aria-label='simple table'
        >
          <TableHead>
            <TableRow>
              <TableCell
                align='center'
                key={makeId()}
                sx={{
                  color: prefs.isDarkMode && 'white',
                }}
              >
                {/* <b> {prefs.isEnglish ? day.eng : day.he}</b> */}
              </TableCell>

              {days.map((day) => {
                return (
                  <TableCell
                    align='center'
                    key={makeId()}
                    sx={{
                      color: prefs.isDarkMode && 'white',
                    }}
                  >
                    <b> {prefs.isEnglish ? day.eng : day.he}</b>
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              key={makeId()}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <TableCell
                component='th'
                scope='row'
                align='center'
                sx={{
                  color: prefs.isDarkMode && 'white',
                }}
                className={`facility-cell ${prefs.isDarkMode && 'dark-mode'}`}
              >
                <b>{prefs.isEnglish ? 'Pool' : 'בריכה'}</b>
              </TableCell>
              {days.map((day) => {
                return (
                  <TableCell
                    component='th'
                    scope='row'
                    align='center'
                    key={makeId()}
                    sx={{
                      color: prefs.isDarkMode && 'white',
                    }}
                  >
                    {day.times.pool.map((time) => {
                      return (
                        <TableCell
                          align='center'
                          key={makeId()}
                          sx={{
                            display: 'grid',
                            color: prefs.isDarkMode && 'white',
                            borderBottom: 'none',
                            padding: '0px',
                            paddingTop: '0.5em',
                            paddingBottom: '0.5em',
                          }}
                        >
                          <div className='time'>
                            <span>{time.from}</span>
                            <span>-</span>
                            <span>{time.to}</span>
                          </div>
                        </TableCell>
                      )
                    })}
                  </TableCell>
                )
              })}
            </TableRow>
            <TableRow
              key={makeId()}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <TableCell
                component='th'
                scope='row'
                align='center'
                sx={{
                  color: prefs.isDarkMode && 'white',
                  padding: '0px',
                  paddingLeft: '0.5em',
                  paddingRight: '0.5em',
                }}
                className={`facility-cell ${prefs.isDarkMode && 'dark-mode'}`}
              >
                <b>{prefs.isEnglish ? 'Gym' : 'חדר הכושר'}</b>
              </TableCell>

              {days.map((day) => {
                return (
                  <TableCell
                    component='th'
                    scope='row'
                    align='center'
                    key={makeId()}
                    sx={{
                      color: prefs.isDarkMode && 'white',
                    }}
                  >
                    {day.times.gym.map((time) => {
                      return (
                        <TableCell
                          align='center'
                          key={makeId()}
                          sx={{
                            display: 'grid',
                            color: prefs.isDarkMode && 'white',
                            borderBottom: 'none',
                          }}
                        >
                          <div className='time'>
                            <span>{time.from}</span>
                            <span>-</span>
                            <span>{time.to}</span>
                          </div>
                        </TableCell>
                      )
                    })}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <ContactUs />
    </div>
  )
}
