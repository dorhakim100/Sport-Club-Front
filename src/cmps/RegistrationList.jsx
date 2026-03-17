import PropTypes from 'prop-types'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useSelector } from 'react-redux'
import { IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'


export function RegistrationList({ slot, deleteRegistration }) {
  const prefs = useSelector((storeState) => storeState.systemModule.prefs)
  const registrations = slot?.registrations || []
  const direction = prefs.isEnglish ? 'ltr' : 'rtl'
  const align = prefs.isEnglish ? 'left' : 'right'

  const getTableContent = () => {

    if(registrations.length === 0) return <TableRow><TableCell align={align}>{prefs.isEnglish ? 'No registrations' : 'אין רישומים'}</TableCell></TableRow>


    return registrations.map((registration, idx) => (
        <TableRow
          key={`${registration.phone || registration.name || 'reg'}-${idx}`}
        >
          <TableCell align={align}>{registration.name || '-'}</TableCell>
          <TableCell align={align}>{registration.phone || '-'}</TableCell>
          <TableCell align={align}>
            <Tooltip title={prefs.isEnglish ? 'Delete' : 'מחיקה'}>

            <IconButton onClick={() => onDeleteRegistration(registration.phone)}><DeleteIcon /></IconButton>
            </Tooltip>
            
            </TableCell>
        </TableRow>
      ))
  }

  const onDeleteRegistration = (registrationPhoneToDelete) => {
    const newSlot = { ...slot, registrations: slot.registrations.filter(registration => registration.phone !== registrationPhoneToDelete) }
    deleteRegistration(newSlot)
  }

  return (
    <TableContainer
      component={Paper}
      className={`registration-list-container ${prefs.isDarkMode ? 'dark-mode' : ''}`}
      sx={{ direction }}
    >
      <Table size='small' aria-label='slot registrations'>
        <TableHead>
          <TableRow>
            <TableCell align={align}>{prefs.isEnglish ? 'Name' : 'שם'}</TableCell>
            <TableCell align={align}>
              {prefs.isEnglish ? 'Phone' : 'מספר טלפון'}
            </TableCell>
            <TableCell align={align}>{prefs.isEnglish ? 'Actions' : 'פעולות'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            
          {getTableContent()}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

RegistrationList.propTypes = {
  slot: PropTypes.shape({
    registrations: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        phone: PropTypes.string,
      })
    ),
  }),
}