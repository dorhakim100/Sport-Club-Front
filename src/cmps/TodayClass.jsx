import { makeId } from '../services/util.service.js'

import { useSelector } from 'react-redux'

import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export function TodayClass({ classes }) {
  const prefs = useSelector((stateSelector) => stateSelector.systemModule.prefs)

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          //   minWidth: 650,
          backgroundColor: prefs.isDarkMode && '#263039',
        }}
        aria-label='simple table'
        className='class-table'
      >
        <TableHead>
          <TableRow>
            <TableCell
              align='center'
              sx={{
                color: prefs.isDarkMode && 'white',
              }}
            >
              <b>{prefs.isEnglish ? 'Title' : 'שם השיעור'}</b>
            </TableCell>
            <TableCell
              align='center'
              sx={{
                color: prefs.isDarkMode && 'white',
              }}
            >
              <b>{prefs.isEnglish ? 'Trainer' : 'מדריך'}</b>
            </TableCell>

            <TableCell
              align='center'
              sx={{
                color: prefs.isDarkMode && 'white',
              }}
            >
              <b>{prefs.isEnglish ? 'From' : 'משעה'}</b>
            </TableCell>
            <TableCell
              align='center'
              sx={{
                color: prefs.isDarkMode && 'white',
              }}
            >
              <b> {prefs.isEnglish ? 'To' : 'עד שעה'}</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classes.length > 0 ? (
            classes.map(
              (clas) =>
                clas.isActive && (
                  <TableRow
                    key={makeId()}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell
                      component='th'
                      scope='row'
                      align='center'
                      sx={{
                        color: prefs.isDarkMode && 'white',
                      }}
                    >
                      {prefs.isEnglish ? clas.title.eng : clas.title.he}
                    </TableCell>
                    <TableCell
                      component='th'
                      scope='row'
                      align='center'
                      sx={{
                        color: prefs.isDarkMode && 'white',
                      }}
                    >
                      {prefs.isEnglish
                        ? clas.trainer.name.eng
                        : clas.trainer.name.he}
                    </TableCell>

                    <TableCell
                      align='center'
                      sx={{
                        color: prefs.isDarkMode && 'white',
                      }}
                    >
                      {clas.from}
                    </TableCell>
                    <TableCell
                      align='center'
                      sx={{
                        color: prefs.isDarkMode && 'white',
                      }}
                    >
                      {clas.to}
                    </TableCell>
                  </TableRow>
                )
            )
          ) : (
            <TableCell
              component='th'
              scope='row'
              align='center'
              sx={{
                color: prefs.isDarkMode && 'white',
                border: 'none',
              }}
            >
              {prefs.isEnglish
                ? 'No active classes today'
                : 'אין שיעורים פעילים היום'}
            </TableCell>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
